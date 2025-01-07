const userRoutes = require('express').Router('');
const userPostRoutes = require('./post/user-post-routes');
const userBlockRoutes = require('./block/user-block-routes');
const userFollowRoutes = require('./follow/user-follow-routes');
const userMuteRoutes = require('./mute/user-mute-routes');
const userCommentRoutes = require('./comment/user-comment-routes');
const { jwtTokenValid } = require('../../middleware/auth-middleware');

// authentication layer - must be first
userRoutes.use(jwtTokenValid);

// user routes
userRoutes.use('/user', [
  userPostRoutes,
  userBlockRoutes,
  userFollowRoutes,
  userMuteRoutes,
  userCommentRoutes
]);

console.log(userRoutes);

module.exports = userRoutes;
