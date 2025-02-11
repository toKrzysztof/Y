const express = require('express');
const jwt = require('jsonwebtoken');
const authRoutes = express.Router();
const { genHash, cmpHash } = require('../../config/hash-config');
const {
  createUser,
  findUser,
  findFollowedUsers,
  findBlockedUsers,
  findMutedUsers
} = require('../../db/queries/user-queries');
const { acquireDbSession, closeDbSession } = require('../../db/db-tools');
const { dbSessionPool } = require('../../server');
const { serializeRid } = require('../../db/orientjs/db-helpers');

const jwtSecret = process.env.JWT_SECRET;

authRoutes.post('/auth/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;

    const session = await acquireDbSession(await dbSessionPool);

    const hashedPassword = genHash(password);

    const createResponse = await createUser(session, name, username, hashedPassword);
    closeDbSession(session);

    if (createResponse === null) {
      return res.status(400).json({ message: 'Must select a unique username!' });
    } else if (username.length < 3) {
      return res
        .status(400)
        .json({ message: 'Username must be at least 3 characters long!' });
    } else if (username.length > 20) {
      return res
        .status(400)
        .json({ message: 'Username cannot be longer than 20 characters!' });
    } else if (name.length > 50) {
      return res
        .status(400)
        .json({ message: 'Name cannot be longer than 50 characters!' });
    } else if (password.length > 100) {
      return res
        .status(400)
        .json({ message: 'Password cannot be longer than 100 characters!' });
    }

    const token = jwt.sign(
      { userId: serializeRid(createResponse['@rid']), username },
      jwtSecret,
      {
        expiresIn: '1h'
      }
    );

    console.log(createResponse);

    res.cookie('auth-token', token, {
      httpOnly: true,
      sameSite: 'strict'
    });

    return res.status(201).json({
      message: `User „${username}” has been registered succesfully!`,
      username,
      name,
      userId: createResponse['@rid']
    });
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

    const followedUsers = await findFollowedUsers(session, user.id);
    const blockedUsers = await findBlockedUsers(session, user.id);
    const mutedUsers = await findMutedUsers(session, user.id);

    res.cookie('auth-token', token, {
      httpOnly: true,
      sameSite: 'strict'
    });

    res.status(200).json({
      message: 'The authentication was successful!',
      username,
      name: user.name,
      userId: user.id,
      followedUsers,
      blockedUsers,
      mutedUsers
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
