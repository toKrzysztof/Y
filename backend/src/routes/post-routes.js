const postRoutes = require('express').Router();
const { createPost, updatePost, deletePost } = require('../db/queries/post-queries');
const { jwtTokenValid } = require('../middleware/auth-middleware');
const { acquireDbSession, closeDbSession } = require('../db/db-tools');
const { dbSessionPool } = require('../server');

postRoutes.post('/post', jwtTokenValid, async (req, res) => {
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

postRoutes.put('/post/:postId', jwtTokenValid, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await createPost(session, postId, title, content);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

postRoutes.delete('/post/:postId', jwtTokenValid, async (req, res) => {
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

module.exports = postRoutes;
