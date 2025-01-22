const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../../utils/verifyToken');
const authRoutes = express.Router();
const { genHash, cmpHash } = require('../../config/hash-config');
const { createUser, findUser } = require('../../db/queries/user-queries');
const { acquireDbSession, closeDbSession } = require('../../db/db-tools');
const { dbSessionPool } = require('../../server');

const jwtSecret = process.env.JWT_SECRET;

authRoutes.post('/auth/register', async (req, res) => {
  try {
    const { username, password, firstName, lastName } = req.body;

    const hashedPassword = genHash(password);

    const session = await acquireDbSession(await dbSessionPool);
    const createResponse = createUser(
      session,
      firstName,
      lastName,
      username,
      hashedPassword
    );
    closeDbSession(session);

    if (createResponse === null) {
      return res.status(400).json({ message: 'Must select a unique username!' });
    } else {
      return res.status(201).json({
        message: `User „${username}” has been registered succesfully!`
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

authRoutes.post('/auth/login', async (req, res) => {
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
    const token = jwt.sign({ userId: user.id, username }, jwtSecret, {
      expiresIn: '1h'
    });

    res.cookie('auth-token', token, {
      httpOnly: true,
      sameSite: 'strict'
    });

    res.status(200).json({
      message: 'The authentication was successful!',
      username,
      userId: user.userId
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

authRoutes.post('/auth/logout', async (req, res) => {
  try {
    res.clearCookie('auth-token');
    res.status(200).json({ message: 'The logout was succesful!' });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

authRoutes.get('/auth/status', async (req, res) => {
  try {
    const token = req.cookies?.['auth-token'];

    if (!token) {
      return res.status(200).json({ tokenValid: false });
    }

    jwt.verify(token, jwtSecret, (err) => {
      if (err) {
        return res.status(200).json({ tokenValid: false });
      }

      res.status(200).json({ tokenValid: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = authRoutes;
