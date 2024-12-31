const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET || 'bardzQQQ tAjn$ hasŁ0';

function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      message: 'Authorization failed - no token provided!'
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Authorization failde - invalid token!'
    });
  }
}

module.exports = verifyToken;
