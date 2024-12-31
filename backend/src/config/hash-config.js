const crypto = require('crypto');

require('dotenv').config({
  path: require('path').join(process.cwd(), '.crypto.env')
});

const SALT = process.env.SALT || 'b3a844b13ff50b99';
const ITERATIONS = parseInt(process.env.ITERATIONS, 10) || 10000;
const KEYLEN = parseInt(process.env.KEYLEN, 10) || 64;
const DIGEST = process.env.DIGEST || 'sha256';

const genHash = (pswd) => {
  return crypto.pbkdf2Sync(pswd, SALT, ITERATIONS, KEYLEN, DIGEST).toString(`hex`);
};

const cmpHash = (pswd, hash) => {
  let hashedPswd = genHash(pswd);
  return hashedPswd == hash;
};

module.exports = {
  genHash,
  cmpHash
};
