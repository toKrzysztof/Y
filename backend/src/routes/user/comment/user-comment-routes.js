const userReplyRoutes = require('express').Router();

const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const { findPost, createPost } = require('../../../db/queries/post-queries');
const { dbSessionPool } = require('../../../server');

userReplyRoutes.post('/reply', async (req, res) => {
  try {
    const { userId } = req.user;
    const { parentId, content, username } = req.body;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await createPost(session, content, [], userId, parentId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// userReplyRoutes.put('/comment/:commentId', async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const session = await acquireDbSession(await dbSessionPool);
//     const data = await updateComment(session, commentId);
//     closeDbSession(session);

//     res.status(200).send(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send();
//   }
// });

// userReplyRoutes.delete('/comment/:commentId', async (req, res) => {
//   try {
//     // TODO - try out the frontend version
//     const base64EncodedCommentId = req.params.commentId;
//     const base64DecodedCommentId = Buffer.from(
//       base64EncodedCommentId,
//       'base64'
//     ).toString();
//     const session = await acquireDbSession(await dbSessionPool);

//     const response = await deleteComment(session, base64DecodedCommentId);
//     closeDbSession(session);

//     res.status(200).send(response);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send();
//   }
// });

module.exports = userReplyRoutes;
