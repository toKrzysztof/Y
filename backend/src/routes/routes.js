const authRoutes = require('./auth/auth-routes');
const userRoutes = require('./user/user-routes');

const routes = [authRoutes, userRoutes];

module.exports = { routes };
