const passport = require('passport');

const jwtTokenValid = passport.authenticate('jwt', { session: false });

module.exports = { jwtTokenValid };
