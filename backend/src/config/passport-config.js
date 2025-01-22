const JwtStrategy = require('passport-jwt').Strategy;

const jwtHttpCookieExtractor = (req) => {
  let jwt = null;

  if (req?.cookies) {
    jwt = req.cookies['auth-token'];
  }

  return jwt;
};

const opts = {
  // MUST BE LOWERCASE - 'Authorization' doesn't work
  jwtFromRequest: jwtHttpCookieExtractor,
  // alternatively: authorization: bearer jwt_token
  // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
  secretOrKey: process.env.JWT_SECRET
};

const setPassportStrategy = (passport) => {
  return passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      return done(null, { userId: jwt_payload.userId, username: jwt_payload.username });
    })
  );
};

module.exports = { setPassportStrategy };
