const authRoutes = require('./auth-routes');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');
const userRoutes = require('./user-routes');

const routes = [authRoutes, postRoutes, commentRoutes, userRoutes];

module.exports = { routes };
