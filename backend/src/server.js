const { dbSetup } = require('./db/db-setup');
const express = require('express');
const app = express();
const passport = require('passport');
const { setPassportStrategy } = require('./config/passport-config');
const cookieParser = require('cookie-parser');
const http = require('http').Server(app);

app.use(cookieParser());
app.use(passport.initialize());
setPassportStrategy(passport);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/healthcheck', (_, res) => {
  res.status(200).send('Server is healthy.');
});
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const dbSessionPool = new Promise(async (resolve, reject) => {
  try {
    const pool = await dbSetup();
    resolve(pool);
  } catch (error) {
    reject(error);
  }
});

async function start() {
  await dbSessionPool;

  const { routes } = require('./routes/routes');
  const { mainWebsocketHandler } = require('./websockets/main-handler');

  app.use(routes);

  const port = process.env.PORT;

  const io = require('socket.io')(http);
  io.use((socket, next) => {
    try {
      const jwtAccessToken = socket.handshake.headers.cookie
        .split(' ')
        .find((el) => el.startsWith('auth-token'))
        .slice(11);

      if (!jwtAccessToken) return next(new Error('Authentication error'));

      const user = jwt.verify(jwtAccessToken, JWT_SECRET);
      socket.userId = user.userId;
      socket.username = user.username;
      next();
    } catch (err) {
      console.log(socket.handshake.headers.cookie);
      console.log(err);
      next(new Error('Invalid token'));
    }
  });
  io.on('connection', mainWebsocketHandler);

  http.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch((err) => console.log(err));

module.exports = { dbSessionPool };
