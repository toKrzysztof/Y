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
      createDbClassEdge(session, 'HasReply'),
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
        createUser(session, 'Alice Smith', 'alice123', genHash('password123')),
        createUser(session, 'Bob', 'bob456', genHash('password456')),
        createUser(session, 'Charlie Brown', 'charlie789', genHash('password789')),
        createUser(session, 'Dave Wilson', 'dave101', genHash('password101')),
        createUser(session, 'Jan', 'Admin', 'j.admin', genHash('qwe#@!')),
        createUser(session, 'Jan', 'User', 'j.user', genHash('qwe#@!'))
      ]);

      if (alice !== null && bob !== null && charlie !== null && dave !== null) {
        await Promise.all([
          followUser(session, alice['@rid'], bob.username),
          followUser(session, alice['@rid'], charlie.username),
          followUser(session, bob['@rid'], dave.username),
          followUser(session, charlie['@rid'], dave.username)
        ]);

        await Promise.all([blockUser(session, charlie['@rid'], bob.username)]);

        const [alicePost, bobPost] = await Promise.all([
          createPost(
            session,
            'Hello everyone! This is my first post here.',
            [
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB_PC93m0bHPZUpGZ1yen5N6-9dRT0Se_18A&s'
            ],
            alice['@rid']
          ),
          createPost(
            session,
            'Perfect day for a picnic in the park!',
            [
              'https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg'
            ],
            bob['@rid']
          )
        ]);

        const [bobReply, charlieReply] = await Promise.all([
          createPost(
            session,
            'Welcome Alice! Great to see you here!',
            [
              'https://media.4-paws.org/a/f/1/e/af1e8ffc278258492c580ef1a4d574cb8e0c6035/Molly_006-2829x1886-2829x1414-600x300.jpg'
            ],
            bob['@rid'],
            alicePost['@rid']
          ),
          createPost(
            session,
            'Thanks for sharing!',
            [
              'https://static1.squarespace.com/static/607f89e638219e13eee71b1e/60a5de2d343ab05906685029/646c549369f8011c28cd5843/1684821591871/michael-sum-LEpfefQf4rU-unsplash.jpg?format=1500w'
            ],
            charlie['@rid'],
            alicePost['@rid']
          )
        ]);

        // await Promise.all([
        //   createComment(
        //     session,
        //     'Thanks Charlie!',
        //     alice['@rid'],
        //     charlieComment['@rid'],
        //     alice.username
        //   ),
        //   createComment(
        //     session,
        //     'Count me in for the picnic!',
        //     dave['@rid'],
        //     bobPost['@rid'],
        //     dave.username
        //   )
        // ]);
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
