const userRoutes = require('express').Router('');
const userPostRoutes = require('./post/user-post-routes');
const userBlockRoutes = require('./block/user-block-routes');
const userFollowRoutes = require('./follow/user-follow-routes');
const userMuteRoutes = require('./mute/user-mute-routes');
const userCommentRoutes = require('./comment/user-comment-routes');
const { jwtTokenValid } = require('../../middleware/auth-middleware');

userRoutes.use('/user', [
  userPostRoutes,
  userBlockRoutes,
  userFollowRoutes,
  userMuteRoutes,
  userCommentRoutes
]);

userRoutes.all('(.*)', jwtTokenValid);

module.exports = userRoutes;
