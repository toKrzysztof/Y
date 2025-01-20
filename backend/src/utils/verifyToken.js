const jwt = require('jsonwebtoken');

const verifyToken = (token, secretOrPublicKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

module.exports = { verifyToken };
