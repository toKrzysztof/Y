const userPostRoutes = require('express').Router();
const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const {
  getPostsMadeByUser,
  getPostsOfFollowees,
  getPostsWithFirstLevelComments,
  createPost
} = require('../../../db/queries/post-queries');
const { dbSessionPool } = require('../../../server');

// posts of a user
userPostRoutes.get('/post/own-post', async (req, res) => {
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
    const { title, content, links } = req.body;

    if (links.length > 3) {
      return res
        .status(400)
        .send({ message: 'A maximum number of 3 links is allowed!' });
    }

    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await createPost(session, title, content, links, userId);
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
