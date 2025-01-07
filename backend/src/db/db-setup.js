const { seedDb } = require('./db-seed');
const {
  connectToDb,
  createDb,
  createDbUser,
  createDbSession,
  doesDbExist,
  doesUserExist,
  changeDbUserPassword,
  closeDbSession,
  createDbSessionPool
} = require('./db-tools');

const ORIENTDB_DB_NAME = process.env.ORIENTDB_DB_NAME;
const ORIENTDB_ROOT_PASSWORD = process.env.ORIENTDB_ROOT_PASSWORD;
const ORIENTDB_ADMIN_USERNAME = process.env.ORIENTDB_ADMIN_USERNAME;
const ORIENTDB_ADMIN_PASSWORD = process.env.ORIENTDB_ADMIN_PASSWORD;
const ORIENTDB_PORT = process.env.ORIENTDB_PORT;
const ORIENTDB_HOST = process.env.ORIENTDB_HOST;

const dbSetup = async () => {
  try {
    const client = await connectToDb(ORIENTDB_HOST, ORIENTDB_PORT);

    if (
      !(await doesDbExist(client, ORIENTDB_DB_NAME, 'root', ORIENTDB_ROOT_PASSWORD))
    ) {
      await createDb(client, ORIENTDB_DB_NAME, 'root', ORIENTDB_ROOT_PASSWORD);
      console.log('Database created!');
    }

    const session = await createDbSession(
      client,
      ORIENTDB_DB_NAME,
      'root',
      ORIENTDB_ROOT_PASSWORD
    );

    if (doesUserExist(session, ORIENTDB_ADMIN_USERNAME)) {
      await changeDbUserPassword(
        session,
        ORIENTDB_ADMIN_USERNAME,
        ORIENTDB_ADMIN_PASSWORD
      );
      console.log("Database user's password changed!");
    } else {
      await createDbUser(
        session,
        ORIENTDB_ADMIN_USERNAME,
        ORIENTDB_ADMIN_PASSWORD,
        'admin'
      );
      console.log('Database user created!');
    }

    await seedDb(session);

    await closeDbSession(session);

    const dbSessionPool = await createDbSessionPool(
      client,
      ORIENTDB_DB_NAME,
      ORIENTDB_ADMIN_USERNAME,
      ORIENTDB_ADMIN_PASSWORD
    );

    return dbSessionPool;
  } catch (err) {
    console.log('Error setting up database:', err);
  }
};

module.exports = { dbSetup };
