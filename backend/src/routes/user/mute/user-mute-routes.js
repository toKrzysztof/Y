const userMuteRoutes = require('express').Router();
const { muteUser, unmuteUser } = require('../../../db/queries/user-queries');

userMuteRoutes.post('/mute/:muteUserId', async (req, res) => {
  try {
    const { userId } = req.user;
    const { muteUserId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await muteUser(session, userId, muteUserId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

userMuteRoutes.delete('/mute/:muteUserId', async (req, res) => {
  try {
    const { userId } = req.user;
    const { muteUserId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await unmuteUser(session, userId, muteUserId);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = userMuteRoutes;
