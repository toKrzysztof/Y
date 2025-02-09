const userProfileRoutes = require('express').Router();
const {
  muteUser,
  unmuteUser,
  findMutedUsers,
  getUserDetails
} = require('../../../db/queries/user-queries');
const { acquireDbSession, closeDbSession } = require('../../../db/db-tools');
const { dbSessionPool } = require('../../../server');

userProfileRoutes.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getUserDetails(session, username);
    closeDbSession(session);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = userProfileRoutes;
