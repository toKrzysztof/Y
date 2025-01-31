const userFollowRoutes = require('express').Router();
const {
  followUser,
  unfollowUser,
  findFollowedUsers
} = require('../../../db/queries/user-queries');
const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const { dbSessionPool } = require('../../../server');

userFollowRoutes.get('/follow', async (req, res) => {
  try {
    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await findFollowedUsers(session, userId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userFollowRoutes.post('/follow/:followUsername', async (req, res) => {
  try {
    const { userId } = req.user;
    const { followUsername } = req.params;
    const ownUsername = req.user.username;

    if (ownUsername === followUsername) {
      res.status(403).send('FORBIDDEN');
    }
    const session = await acquireDbSession(await dbSessionPool);
    const data = await followUser(session, userId, followUsername);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userFollowRoutes.delete(
  '/follow/:followUsername',

  async (req, res) => {
    try {
      const { userId } = req.user;
      const { followUsername } = req.params;
      const session = await acquireDbSession(await dbSessionPool);
      const data = await unfollowUser(session, userId, followUsername);
      closeDbSession(session);

      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
);

module.exports = userFollowRoutes;
