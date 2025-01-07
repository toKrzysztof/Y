const userFollowRoutes = require('express').Router();
const { followUser, unfollowUser } = require('../../../db/queries/user-queries');

userFollowRoutes.post('/follow/:followUserId', async (req, res) => {
  try {
    const { userId } = req.user;
    const { followUserId } = req.params;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await followUser(session, userId, followUserId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userFollowRoutes.delete(
  '/follow/:followUserId',

  async (req, res) => {
    try {
      const { userId } = req.user;
      const { followUserId } = req.params;
      const session = await acquireDbSession(await dbSessionPool);
      const data = await unfollowUser(session, userId, followUserId);
      closeDbSession(session);

      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
);

module.exports = userFollowRoutes;
