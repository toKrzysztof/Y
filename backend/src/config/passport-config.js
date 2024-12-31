const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
  secretOrKey: process.env.JWT_SECRET || 'bardzQQQ tAjn$ hasŁ0'
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log('Jwt payload:', jwt_payload);
      return done(null, jwt_payload.userId);
    })
  );
};
