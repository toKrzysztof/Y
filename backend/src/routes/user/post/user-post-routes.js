const userPostRoutes = require('express').Router();
const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const {
  getPostsMadeByUser,
  getPostsOfFollowedUsers,
  getRandomPostsWithFirstLevelReplies,
  createPost,
  deletePost
} = require('../../../db/queries/post-queries');
const { dbSessionPool } = require('../../../server');

// posts of a user
userPostRoutes.get('/post/own-post', async (req, res) => {
  try {
    const { userId } = req.user;
    const { skip, limit } = req.query;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getPostsMadeByUser(session, userId, skip, limit);

    closeDbSession(session);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// random posts from non-blocked users
userPostRoutes.get('/post', async (req, res) => {
  try {
    const { userId } = req.user;
    const limit = 10;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getRandomPostsWithFirstLevelReplies(session, userId, limit);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// posts of followed users
userPostRoutes.get('/post/follow', async (req, res) => {
  try {
    const { userId } = req.user;
    const { skip, limit } = req.query;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getPostsOfFollowedUsers(session, userId, skip, limit);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userPostRoutes.post('/post', async (req, res) => {
  try {
    const { title, content, links } = req.body;

    if (links.length > 3) {
      return res
        .status(400)
        .send({ message: 'A maximum number of 3 links is allowed!' });
    }

    const { userId, username } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await createPost(session, title, content, links, userId, username);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userPostRoutes.put('/user/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await updatePost(session, postId, title, content);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userPostRoutes.delete('/user/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await deletePost(session, postId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = userPostRoutes;
