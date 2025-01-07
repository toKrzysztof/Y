const userCommentRoutes = require('express').Router();
const {
  updateComment,
  deleteComment,
  getCommentTree
} = require('../../../db/queries/comment-queries');

userCommentRoutes.get('/comment/:commentId/comment', async (req, res) => {
  const { commentId } = req.params;

  try {
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getCommentTree(session, commentId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userCommentRoutes.put('/comment/:commentId', async (req, res) => {
  const { commentId } = req.params;

  try {
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
  const { commentId } = req.params;

  try {
    const session = await acquireDbSession(await dbSessionPool);
    deleteComment(session, commentId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = userCommentRoutes;
