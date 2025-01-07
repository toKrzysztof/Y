const { genHash } = require('../config/hash-config');
const { createDbClassVertex, createDbClassEdge } = require('./db-tools');
const { createUser, followUser, muteUser } = require('./queries/user-queries');
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
          followUser(session, alice['@rid'], bob['@rid']),
          followUser(session, alice['@rid'], charlie['@rid']),
          followUser(session, bob['@rid'], dave['@rid']),
          followUser(session, charlie['@rid'], dave['@rid'])
        ]);

        // Create mute network (in parallel)
        await Promise.all([muteUser(session, charlie['@rid'], bob['@rid'])]);

        // Create posts (in parallel)
        const [alicePost, bobPost] = await Promise.all([
          createPost(session, {
            title: 'My First Post',
            content: 'Hello everyone! This is my first post here.',
            userId: alice['@rid']
          }),
          createPost(session, {
            title: 'Great Weather Today',
            content: 'Perfect day for a picnic in the park!',
            userId: bob['@rid']
          })
        ]);

        // Create initial comments (in parallel)
        const [bobComment, charlieComment] = await Promise.all([
          createComment(session, {
            content: 'Welcome Alice! Great to see you here!',
            userId: bob['@rid'],
            parentId: alicePost['@rid'],
            parentType: 'Post'
          }),
          createComment(session, {
            content: 'Thanks for sharing!',
            userId: charlie['@rid'],
            parentId: alicePost['@rid'],
            parentType: 'Post'
          })
        ]);

        // Create nested comments and Dave's comment (in parallel)
        await Promise.all([
          createComment(session, {
            content: 'Thanks Charlie!',
            userId: alice['@rid'],
            parentId: charlieComment['@rid'],
            parentType: 'Comment'
          }),
          createComment(session, {
            content: 'Count me in for the picnic!',
            userId: dave['@rid'],
            parentId: bobPost['@rid'],
            parentType: 'Post'
          })
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
