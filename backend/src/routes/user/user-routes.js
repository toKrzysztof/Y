const userRoutes = require('express').Router('');
const userPostRoutes = require('./post/user-post-routes');
const userBlockRoutes = require('./block/user-block-routes');
const userFollowRoutes = require('./follow/user-follow-routes');
const userMuteRoutes = require('./mute/user-mute-routes');
const { jwtTokenValid } = require('../../middleware/auth-middleware');
const userCommentRoutes = require('./comment/user-comment-routes');

// authentication layer - must be first
userRoutes.use(jwtTokenValid);

// user routes
userRoutes.use('/user', [
  userPostRoutes,
  userBlockRoutes,
  userFollowRoutes,
  userCommentRoutes,
  userMuteRoutes
]);

userRoutes.get('/');

module.exports = userRoutes;
