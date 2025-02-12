const { injectRids } = require('../orientjs/db-query-param-injectors');

const findUser = async (session, username) => {
  return await session
    .query(
      `
    SELECT @rid as id, password, name FROM User 
    WHERE username = :username
  `,
      { params: { username } }
    )
    .one();
};

const getUserDetails = async (session, username) => {
  return await session
    .query(
      `
    SELECT username, name, out('HasPost') as posts FROM User 
    WHERE username = :username
  `,
      { params: { username } }
    )
    .one();
};

const findFollowedUsers = async (session, userId) => {
  return await session
    .query(
      `
SELECT @rid as id, username, name FROM (SELECT expand(out('Follows')) FROM User WHERE @rid = :userId)
  `,
      { params: { userId } }
    )
    .all();
};

const findBlockedUsers = async (session, userId) => {
  return await session
    .query(
      `
SELECT @rid as id, username, name FROM (SELECT expand(out('Blocks')) FROM User WHERE @rid = :userId)
  `,
      { params: { userId } }
    )
    .all();
};

const findMutedUsers = async (session, userId) => {
  return await session
    .query(
      `
SELECT @rid as id, username, name FROM (SELECT expand(out('Mutes')) FROM User WHERE @rid = :userId)
  `,
      { params: { userId } }
    )
    .all();
};
const createUser = async (session, name, username, password) => {
  const existingUser = await session
    .query(`SELECT FROM User WHERE username = :username`, { params: { username } })
    .one();

  if (!existingUser) {
    return await session
      .command(
        `INSERT INTO User SET 
          name = :name, 
          username = :username, 
          password = :password,
          createdAt = :now, 
          updatedAt = :now
        `,
        {
          params: {
            name,
            username,
            password,
            now: new Date()
          }
        }
      )
      .one();
  }

  return null;
};

const followUser = async (session, userId, followedUsername) => {
  const existingEdge = await session
    .query(
      `SELECT FROM (SELECT expand(in) FROM Follows WHERE out = :userId) WHERE username = :followedUsername`,
      {
        params: { userId, followedUsername }
      }
    )
    .one();

  if (!existingEdge) {
    const query = injectRids(
      `CREATE EDGE Follows FROM :userId TO (SELECT FROM User WHERE username = :followedUsername)`,
      { userId }
    );

    return await session.command(query, { params: { followedUsername } }).one();
  }

  return null; // Edge already exists
};

const unfollowUser = async (session, userId, unfollowedUsername) => {
  return await session
    .command(
      `
    DELETE EDGE Follows 
    WHERE out.@rid = :userId 
    AND in.username = :unfollowedUsername
  `,
      { params: { userId, unfollowedUsername } }
    )
    .all();
};

const muteUser = async (session, userId, mutedUsername) => {
  const existingEdge = await session
    .query(
      `SELECT FROM (SELECT expand(in) FROM Mutes WHERE out = :userId) WHERE username = :mutedUsername`,
      {
        params: { userId, mutedUsername }
      }
    )
    .one();

  if (!existingEdge) {
    const query = injectRids(
      `CREATE EDGE Mutes FROM :userId TO (SELECT FROM User WHERE username = :mutedUsername)`,
      { userId }
    );

    return await session.command(query, { params: { mutedUsername } }).one();
  }

  return null; // Edge already exists
};

const unmuteUser = async (session, userId, unmutedUsername) => {
  return await session
    .command(
      `
    DELETE EDGE Mutes 
    WHERE out.@rid = :userId 
    AND in.username = :unmutedUsername
  `,
      { params: { userId, unmutedUsername } }
    )
    .all();
};

const blockUser = async (session, userId, blockedUsername) => {
  const existingEdge = await session
    .query(
      `SELECT FROM (SELECT expand(in) FROM Blocks WHERE out = :userId) WHERE username = :blockedUsername`,
      {
        params: { userId, blockedUsername }
      }
    )
    .one();

  // unfollow user on block
  await session
    .command(
      `
    DELETE EDGE Follows 
    WHERE out.@rid = :userId 
    AND in.username = :unfollowedUsername
  `,
      { params: { userId, unfollowedUsername: blockedUsername } }
    )
    .all();

  // make user unfollow on block
  await session
    .command(
      `
    DELETE EDGE Follows 
    WHERE in.@rid = :userId 
    AND out.username = :unfollowedUsername
  `,
      { params: { userId, unfollowedUsername: blockedUsername } }
    )
    .all();

  if (!existingEdge) {
    const query = injectRids(
      `CREATE EDGE Blocks FROM :userId TO (SELECT FROM User WHERE username = :blockedUsername)`,
      { userId }
    );

    return await session.command(query, { params: { blockedUsername } }).one();
  }

  return null; // Edge already exists
};

const unblockUser = async (session, userId, unblockedUsername) => {
  return await session
    .command(
      `
    DELETE EDGE Blocks 
    WHERE out.@rid = :userId 
    AND in.username = :unblockedUsername
  `,
      { params: { userId, unblockedUsername } }
    )
    .all();
};

module.exports = {
  createUser,
  findUser,
  findFollowedUsers,
  findMutedUsers,
  findBlockedUsers,
  followUser,
  unfollowUser,
  muteUser,
  unmuteUser,
  blockUser,
  unblockUser,
  getUserDetails
};
