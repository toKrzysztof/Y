const userPostRoutes = require('express').Router();
const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const {
  getPostsMadeByUser,
  getPostsOfFollowees,
  getPostsWithFirstLevelComments
} = require('../../../db/queries/post-queries');
const { dbSessionPool } = require('../../../server');

// posts of a user
userPostRoutes.get('/post/my-post', async (req, res) => {
  try {
    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getPostsMadeByUser(session, userId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// posts from all non-blocked users
userPostRoutes.get('/post', async (req, res) => {
  try {
    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getPostsWithFirstLevelComments(session, userId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// posts of followed users
userPostRoutes.get('/post/folowee', async (req, res) => {
  try {
    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getPostsOfFollowees(session, userId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userPostRoutes.post('/post', async (req, res) => {
  try {
    const { title, content } = req.body;
    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await createPost(session, title, content, userId);
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
