const { injectRid } = require('../orientjs/db-query-param-injectors');

const findUser = async (session, username) => {
  return await session
    .query(
      `
    SELECT @rid as id, password FROM User 
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
SELECT @rid as id, username, firstName, lastName FROM (SELECT expand(out('Follows')) FROM User WHERE @rid = :userId)
  `,
      { params: { userId } }
    )
    .all();
};

const findBlockedUsers = async (session, userId) => {
  return await session
    .query(
      `
SELECT @rid as id, username, firstName, lastName FROM (SELECT expand(out('Blocks')) FROM User WHERE @rid = :userId)
  `,
      { params: { userId } }
    )
    .all();
};

const findMutedUsers = async (session, userId) => {
  return await session
    .query(
      `
SELECT @rid as id, username, firstName, lastName FROM (SELECT expand(out('Mutes')) FROM User WHERE @rid = :userId)
  `,
      { params: { userId } }
    )
    .all();
};
const createUser = async (session, firstName, lastName, username, password) => {
  const existingUser = await session
    .query(`SELECT FROM User WHERE username = :username`, { params: { username } })
    .one();

  if (!existingUser) {
    return await session
      .command(
        `INSERT INTO User SET 
          firstName = :firstName, 
          lastName = :lastName, 
          username = :username, 
          password = :password,
          createdAt = :now, 
          updatedAt = :now
        `,
        {
          params: {
            firstName,
            lastName,
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
    .query(`SELECT FROM Follows WHERE out = :userId AND in = :followedUsername`, {
      params: { userId, followedUsername }
    })
    .one();

  if (!existingEdge) {
    const query = injectRid(
      `CREATE EDGE Follows FROM :userId TO (SELECT FROM User WHERE username = :followedUsername)`,
      'userId',
      userId
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
    .query(`SELECT FROM Mutes WHERE out = :userId AND in = :mutedUsername`, {
      params: { userId, mutedUsername }
    })
    .one();

  if (!existingEdge) {
    return await session.create().one();
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
    .query(`SELECT FROM Blocks WHERE out = :userId AND in = :blockedUsername`, {
      params: { userId, blockedUsername }
    })
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

  if (!existingEdge) {
    return await session
      .command(
        `CREATE EDGE Blocks FROM (SELECT FROM V WHERE @rid = :userId) TO (SELECT FROM V WHERE username = :blockedUsername)`,
        {
          params: { userId, blockedUsername }
        }
      )
      .one();
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
  unblockUser
};
