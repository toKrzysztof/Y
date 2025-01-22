const { genHash } = require('../config/hash-config');
const { createDbClassVertex, createDbClassEdge } = require('./db-tools');
const { createUser, followUser, blockUser } = require('./queries/user-queries');
const { createPost } = require('./queries/post-queries');
const { createComment } = require('./queries/comment-queries');

const seedDb = async (session) => {
  try {
    return Promise.all([
      createDbClassVertex(session, 'User'),
      createDbClassVertex(session, 'Post'),
      createDbClassVertex(session, 'Comment'),
      createDbClassEdge(session, 'HasComment'),
      createDbClassEdge(session, 'Follows'),
      createDbClassEdge(session, 'Mutes'),
      createDbClassEdge(session, 'Blocks'),
      createDbClassEdge(session, 'HasPost'),
      createDbClassEdge(session, 'MadeComment'),
      populateClasses(session)
    ]);
  } catch (err) {
    console.log(err);
  }
};

const populateClasses = (session) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create users
      const [alice, bob, charlie, dave] = await Promise.all([
        createUser(session, 'Alice', 'Smith', 'alice123', genHash('password123')),
        createUser(session, 'Bob', 'Johnson', 'bob456', genHash('password456')),
        createUser(session, 'Charlie', 'Brown', 'charlie789', genHash('password789')),
        createUser(session, 'Dave', 'Wilson', 'dave101', genHash('password101')),
        createUser(session, 'Jan', 'Admin', 'j.admin', genHash('qwe#@!')),
        createUser(session, 'Jan', 'User', 'j.user', genHash('qwe#@!'))
      ]);

      if (alice !== null && bob !== null && charlie !== null && dave !== null) {
        // Create follow network (in parallel)
        await Promise.all([
          followUser(session, alice['@rid'], bob.username),
          followUser(session, alice['@rid'], charlie.username),
          followUser(session, bob['@rid'], dave.username),
          followUser(session, charlie['@rid'], dave.username)
        ]);

        // Create block network (in parallel)
        await Promise.all([blockUser(session, charlie.username, bob.username)]);

        // Create posts (in parallel)
        const [alicePost, bobPost] = await Promise.all([
          createPost(
            session,
            'My First Post',
            'Hello everyone! This is my first post here.',
            [],
            alice['@rid'],
            alice.username
          ),
          createPost(
            session,
            'Great Weather Today',
            'Perfect day for a picnic in the park!',
            [],
            bob['@rid'],
            alice.username
          )
        ]);

        // Create initial comments (in parallel)
        const [bobComment, charlieComment] = await Promise.all([
          createComment(
            session,
            'Welcome Alice! Great to see you here!',
            bob['@rid'],
            alicePost['@rid'],
            'Post',
            bob.username
          ),
          createComment(
            session,
            'Thanks for sharing!',
            charlie['@rid'],
            alicePost['@rid'],
            'Post',
            charlie.username
          )
        ]);

        // Create nested comments and Dave's comment (in parallel)
        await Promise.all([
          createComment(
            session,
            'Thanks Charlie!',
            alice['@rid'],
            charlieComment['@rid'],
            'Comment',
            alice.username
          ),
          createComment(
            session,
            'Count me in for the picnic!',
            dave['@rid'],
            bobPost['@rid'],
            'Post',
            dave.username
          )
        ]);
      }

      console.log('Database seeded successfully!');
      resolve();
    } catch (error) {
      console.error('Error seeding database:', error);
      reject(error);
    }
  });
};

module.exports = { seedDb };
