const express = require('express');
const jwt = require('jsonwebtoken');
const authRoutes = express.Router();
const { genHash, cmpHash } = require('../../config/hash-config');
const { createUser, findUser } = require('../../db/queries/user-queries');
const { acquireDbSession, closeDbSession } = require('../../db/db-tools');
const { dbSessionPool } = require('../../server');

const jwtSecret = process.env.JWT_SECRET;

authRoutes.post('/register', async (req, res) => {
  try {
    const { username, password, firstName, lastName } = req.body;

    const hashedPassword = genHash(password);

    const session = await acquireDbSession(await dbSessionPool);
    createUser(session, firstName, lastName, username, hashedPassword);
    closeDbSession(session);

    res.status(201).json({
      message: `User „${username}” has been registered succesfully!`
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

authRoutes.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const session = await acquireDbSession(await dbSessionPool);
    const user = await findUser(session, username);
    closeDbSession(session);

    if (!user) {
      return res.status(401).json({
        message: `The authentication was unsuccessful!`
      });
    }

    const authenticated = cmpHash(password, user.password);

    if (!authenticated) {
      return res.status(401).json({
        message: `The authentication was unsuccessful!`
      });
    }

    // TODO - implement refresh tokens
    const token = jwt.sign({ userId: user['@rid'] }, jwtSecret, {
      expiresIn: '1h'
    });

    res.status(200).json({
      message: 'The authentication was successful!',
      Authorization: token
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = authRoutes;
