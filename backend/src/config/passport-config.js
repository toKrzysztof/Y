const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
  // MUST BE LOWERCASE - 'Authorization' doesn't work
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // alternatively: authorization: bearer jwt_token
  // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
  secretOrKey: process.env.JWT_SECRET
};

const setPassportStrategy = (passport) => {
  return passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      return done(null, { userId: jwt_payload.userId });
    })
  );
};

module.exports = { setPassportStrategy };
