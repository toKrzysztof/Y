const userBlockRoutes = require('express').Router();
const { blockUser, unblockUser } = require('../../../db/queries/user-queries');
const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const { dbSessionPool } = require('../../../server');

userBlockRoutes.post('/block/:blockUserId', async (req, res) => {
  try {
    const { userId } = req.user;
    const { blockUserId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await blockUser(session, userId, blockUserId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userBlockRoutes.delete('/block/:blockUserId', async (req, res) => {
  try {
    const { userId } = req.user;
    const { blockUserId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await unblockUser(session, userId, blockUserId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = userBlockRoutes;
