const { dbSetup } = require('./db/setup-db');

// require('dotenv').config({
//   path: path.join(process.cwd(), '.app.env')
// });

const express = require('express');
const app = express();

const passport = require('passport');
app.use(passport.initialize());
require('./config/passport-config')(passport);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const authRoutes = require('./routes/auth-routes');
app.use('/auth', authRoutes);

app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('Aqq panie Kruku!');
});

async function start() {
  await dbSetup();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
  });
}

start().catch((err) => console.log(err));
