const userRoutes = require('express').Router('');
const userPostRoutes = require('./post/user-post-routes');
const userBlockRoutes = require('./block/user-block-routes');
const userFollowRoutes = require('./follow/user-follow-routes');
const userMuteRoutes = require('./mute/user-mute-routes');
const { jwtTokenValid } = require('../../middleware/auth-middleware');
const userCommentRoutes = require('./comment/user-comment-routes');
const userProfileRoutes = require('./profile/user-profile-routes');

// authentication layer - must be first
userRoutes.use(jwtTokenValid);

// user routes
userRoutes.use('/user', [
  userPostRoutes,
  userBlockRoutes,
  userFollowRoutes,
  userCommentRoutes,
  userMuteRoutes,
  userProfileRoutes
]);

module.exports = userRoutes;
