const userPostRoutes = require('express').Router();
const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const {
  getPostsMadeByUser,
  getPostsOfFollowedUsers,
  getNewestPosts,
  createPost,
  deletePost,
  getPostReplies,
  findPost
} = require('../../../db/queries/post-queries');
const { dbSessionPool } = require('../../../server');
const { postPublisher } = require('../../../websockets/publishers/postPublisher');

// posts of a user
userPostRoutes.get('/post/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { skip, limit } = req.query;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getPostsMadeByUser(session, username, skip, limit);

    closeDbSession(session);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// newest posts
userPostRoutes.get('/post', async (req, res) => {
  try {
    const { userId } = req.user;
    const { skip, limit } = req.query;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getNewestPosts(session, skip, limit, userId);
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

userPostRoutes.get('/post/:postId', async (req, res) => {
  try {
    const { userId } = req.user;
    const { skip, limit } = req.query;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getNewestPosts(session, skip, limit);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userPostRoutes.post('/post', async (req, res) => {
  try {
    const { content, links, parentId } = req.body;
    const { userId } = req.user;

    const session = await acquireDbSession(await dbSessionPool);
    console.log(parentId);
    const data = await createPost(session, content, links, userId, parentId || null);
    postPublisher.publishNewPost(data);
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

userPostRoutes.get('/post/reply/:replyId', async (req, res) => {
  try {
    const base64EncodedReplyId = req.params.replyId;
    const decodedReplyId = atob(base64EncodedReplyId);
    const session = await acquireDbSession(await dbSessionPool);
    const data = await findPost(session, decodedReplyId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userPostRoutes.get('/post/reply/:replyId/reply', async (req, res) => {
  try {
    const { limit, skip } = req.query;
    const base64EncodedCommentId = req.params.replyId;
    const decodedCommentId = atob(base64EncodedCommentId);
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getPostReplies(session, decodedCommentId, limit, skip);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = userPostRoutes;
