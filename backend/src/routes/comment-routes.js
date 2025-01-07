const commentRoutes = require('express').Router();
const {
  updateComment,
  deleteComment,
  getCommentTree
} = require('../db/queries/comment-queries');
const { jwtTokenValid } = require('../middleware/auth-middleware');

commentRoutes.get('/comment/:commentId/comment', jwtTokenValid, async (req, res) => {
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

commentRoutes.put('/comment/:commentId', jwtTokenValid, async (req, res) => {
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

commentRoutes.delete('/comment/:commentId', jwtTokenValid, async (req, res) => {
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

module.exports = commentRoutes;
