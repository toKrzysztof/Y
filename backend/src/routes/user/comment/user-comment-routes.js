const userCommentRoutes = require('express').Router();

const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const {
  getCommentReplies,
  updateComment,
  deleteComment,
  findComment,
  createComment
} = require('../../../db/queries/comment-queries');
const { dbSessionPool } = require('../../../server');

userCommentRoutes.get('/comment/:commentId', async (req, res) => {
  try {
    const base64EncodedCommentId = req.params.commentId;
    const decodedCommentId = atob(base64EncodedCommentId);
    const session = await acquireDbSession(await dbSessionPool);
    const data = await findComment(session, decodedCommentId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userCommentRoutes.get('/comment/:commentId/comment', async (req, res) => {
  try {
    const { limit, skip } = req.query;
    const base64EncodedCommentId = req.params.commentId;
    const decodedCommentId = atob(base64EncodedCommentId);
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getCommentReplies(session, decodedCommentId, limit, skip);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userCommentRoutes.post('/comment', async (req, res) => {
  try {
    const { userId } = req.user;
    const { parentId, content, username } = req.body;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await createComment(session, content, userId, parentId, username);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userCommentRoutes.put('/comment/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await updateComment(session, commentId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userCommentRoutes.delete('/comment/:commentId', async (req, res) => {
  try {
    // TODO - try out the frontend version
    const base64EncodedCommentId = req.params.commentId;
    const base64DecodedCommentId = Buffer.from(
      base64EncodedCommentId,
      'base64'
    ).toString();
    const session = await acquireDbSession(await dbSessionPool);

    const response = await deleteComment(session, base64DecodedCommentId);
    closeDbSession(session);

    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = userCommentRoutes;
