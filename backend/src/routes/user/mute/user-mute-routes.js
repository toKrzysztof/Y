const userMuteRoutes = require('express').Router();
const {
  muteUser,
  unmuteUser,
  findMutedUsers
} = require('../../../db/queries/user-queries');
const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const { dbSessionPool } = require('../../../server');

userMuteRoutes.get('/mute', async (req, res) => {
  try {
    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await findMutedUsers(session, userId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userMuteRoutes.post('/mute/:muteUsername', async (req, res) => {
  try {
    const { userId } = req.user;
    const { muteUsername } = req.params;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await muteUser(session, userId, muteUsername);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userMuteRoutes.delete('/mute/:muteUsername', async (req, res) => {
  try {
    const { userId } = req.user;
    const { muteUsername } = req.params;

    const session = await acquireDbSession(await dbSessionPool);
    const data = await unmuteUser(session, userId, muteUsername);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = userMuteRoutes;
