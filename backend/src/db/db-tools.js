const OrientDBClient = require('orientjs').OrientDBClient;
// start - DB setup
const connectToDb = async (host, port) => {
  const dbClient = await OrientDBClient.connect({ host, port });

  return dbClient;
};

const closeDbConnection = async (dbClient) => {
  const res = await dbClient.close();

  return res;
};

const doesDbExist = async (dbClient, dbName, username, password) => {
  const res = await dbClient.existsDatabase({
    name: dbName,
    username,
    password
  });

  return res;
};

const createDb = async (dbClient, dbName, username, password) => {
  const res = await dbClient.createDatabase({
    name: dbName,
    username,
    password
  });

  return res;
};

const doesUserExist = async (session, username) => {
  const res = await session.command('SELECT FROM OUser WHERE name = :username', {
    params: { username }
  });

  return res;
};

const createDbUser = async (session, newUser, newPassword, role) => {
  const res = await session.command(
    'CREATE USER :newUser IDENTIFIED BY :newPassword ROLE :role',
    { params: { newUser, newPassword, role } }
  );

  return res;
};

const changeDbUserPassword = async (session, username, newPassword) => {
  const res = await session.command(
    'UPDATE OUser SET password = :password WHERE name = :username',
    {
      params: {
        username,
        password: newPassword
      }
    }
  );

  return res;
};

const createDbSession = async (dbClient, dbName, username, password) => {
  const session = await dbClient.session({
    name: dbName,
    username,
    password
  });

  return session;
};

const createDbSessionPool = async (dbClient, dbName, username, password) => {
  const pool = await dbClient.sessions({
    name: dbName,
    username,
    password
  });

  return pool;
};

const dbSetup = {
  connectToDb,
  closeDbConnection,
  doesDbExist,
  createDb,
  doesUserExist,
  createDbUser,
  changeDbUserPassword,
  createDbSession,
  createDbSessionPool
};
// end - DB setup

// start - DB utils
const acquireDbSession = async (pool) => {
  const session = await pool.acquire();

  return session;
};

const closeDbSession = async (session) => {
  const res = await session.close();

  return res;
};

const dbUtils = { acquireDbSession, closeDbSession };
// end - DB utils

// start - DB cleanup
const closeDbSessionPool = async (pool) => {
  await pool.close();
};

const dbCleanup = { closeDbSessionPool };
// end - DB

module.exports = { ...dbSetup, ...dbUtils, ...dbCleanup };
