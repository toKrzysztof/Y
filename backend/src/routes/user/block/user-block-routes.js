const userBlockRoutes = require('express').Router();
const {
  blockUser,
  unblockUser,
  findBlockedUsers
} = require('../../../db/queries/user-queries');
const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const { dbSessionPool } = require('../../../server');

userBlockRoutes.get('/block', async (req, res) => {
  try {
    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await findBlockedUsers(session, userId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userBlockRoutes.post('/block/:blockUsername', async (req, res) => {
  try {
    const { userId } = req.user;
    const { blockUsername } = req.params;
    const ownUsername = req.user.username;

    if (ownUsername === blockUsername) {
      res.status(403).send('FORBIDDEN');
    }
    const session = await acquireDbSession(await dbSessionPool);
    const data = await blockUser(session, userId, blockUsername);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userBlockRoutes.delete('/block/:blockUsername', async (req, res) => {
  try {
    const { userId } = req.user;
    const { blockUsername } = req.params;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await unblockUser(session, userId, blockUsername);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = userBlockRoutes;
