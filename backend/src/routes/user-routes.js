const userRoutes = require('express').Router();
const {
  followUser,
  getPostsMadeByUser,
  getPostsOfFollowees,
  getPostsWithFirstLevelComments,
  muteUser,
  blockUser,
  unfollowUser,
  unmuteUser,
  unblockUser
} = require('../db/queries/user-queries');

const { jwtTokenValid } = require('../middleware/auth-middleware');
const { acquireDbSession, closeDbSession } = require('../db/db-tools');
const { dbSessionPool } = require('../server');

userRoutes.post('/user/follow/:followUserId', jwtTokenValid, async (req, res) => {
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

userRoutes.delete('/user/follow/:followUserId', jwtTokenValid, async (req, res) => {
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
});

userRoutes.post('/user/mute/:muteUserId', jwtTokenValid, async (req, res) => {
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

userRoutes.delete('/user/mute/:muteUserId', jwtTokenValid, async (req, res) => {
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

userRoutes.post('/user/block/:blockUserId', jwtTokenValid, async (req, res) => {
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

userRoutes.delete('/user/block/:blockUserId', jwtTokenValid, async (req, res) => {
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

// posts from all non-blocked users
userRoutes.get('/user/post', jwtTokenValid, async (req, res) => {
  try {
    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getPostsWithFirstLevelComments(session, userId);
    closeDbSession(session);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// posts of followed users
userRoutes.get('/user/folowee/post', jwtTokenValid, async (req, res) => {
  try {
    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getPostsOfFollowees(session, userId);
    closeDbSession(session);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// posts of a user
userRoutes.get('/user/my-post', jwtTokenValid, async (req, res) => {
  try {
    const { userId } = req.user;
    const session = await acquireDbSession(await dbSessionPool);
    const data = await getPostsMadeByUser(session, userId);
    closeDbSession(session);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = userRoutes;
