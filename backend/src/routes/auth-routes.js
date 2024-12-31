const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { genHash, cmpHash } = require('../config/hash-config');

// const User = require('../models/User');

const secretKey = process.env.SECRET || 'bardzQQQ tAjn$ hasŁ0';

// Rejestracja użytkownika
// router.get('/register', (_req, res) => {
//   res.render('register');
// });

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = genHash(password);

    await new User({
      username,
      password: hashedPassword
    }).save();

    res.status(201).json({
      message: `User „${username}” has been registered succesfully!`
    });
  } catch (err) {
    console.dir(err);
    res.status(500).json({
      message: 'The registration was unsucceful!',
      problem: err.errorResponse
    });
  }
});

// Logowanie do aplikacji
// router.get('/login', (_req, res) => {
//   console.log('test');
//   res.render('login');
// });

router.post('/login', async (req, res) => {
  try {
    // const { username, password } = req.body;
    // const user = await User.findOne({ username });

    // if (!user) {
    //   return res.status(401).json({
    //     message: `The authentication was unsuccessful!`
    //   });
    // }

    // const authenticated = cmpHash(password, user.password);

    // if (!authenticated) {
    //   return res.status(401).json({
    //     message: `The authentication was unsuccessful!`
    //   });
    // }

    const token = jwt.sign({ userId: 'user._id' }, secretKey, {
      expiresIn: '1h'
    });

    res.status(200).json({
      message: 'The authentication was successful!',
      Authorization: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'The authentication was unsuccesful!',
      problem: err.errorResponse
    });
  }
});

module.exports = router;
