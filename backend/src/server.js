const { dbSetup } = require('./db/db-setup');
const express = require('express');
const app = express();
const passport = require('passport');
const { setPassportStrategy } = require('./config/passport-config');

app.use(passport.initialize());
setPassportStrategy(passport);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/healthcheck', (_, res) => {
  res.status(200).send('Server is healthy.');
});

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
  app.use(routes);

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
  });
}

start().catch((err) => console.log(err));

module.exports = { dbSessionPool };
