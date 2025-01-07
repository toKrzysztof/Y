const findUser = async (session, username) => {
  return await session
    .query(
      `
    SELECT FROM User 
    WHERE username = :username
  `,
      { params: { username } }
    )
    .one();
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

const followUser = async (session, user1Id, user2Id) => {
  const existingEdge = await session
    .query(`SELECT FROM Follows WHERE out = :user1Id AND in = :user2Id`, {
      params: { user1Id, user2Id }
    })
    .one();

  if (!existingEdge) {
    return await session
      .command(
        `CREATE EDGE Follows FROM (SELECT FROM V WHERE @rid = :user1Id) TO (SELECT FROM V WHERE @rid = :user2Id)`,
        {
          params: { user1Id, user2Id }
        }
      )
      .one();
  }

  return null; // Edge already exists
};

const unfollowUser = async (session, userId1, userId2) => {
  return await session
    .command(
      `
    DELETE EDGE Follows 
    WHERE out.userId = :userId1 
    AND in.userId = :userId2
  `,
      { params: { userId1, userId2 } }
    )
    .all();
};

const muteUser = async (session, user1Id, user2Id) => {
  const existingEdge = await session
    .query(`SELECT FROM Mutes WHERE out = :user1Id AND in = :user2Id`, {
      params: { user1Id, user2Id }
    })
    .one();

  if (!existingEdge) {
    return await session
      .command(
        `CREATE EDGE Mutes FROM (SELECT FROM V WHERE @rid = :user1Id) TO (SELECT FROM V WHERE @rid = :user2Id)`,
        {
          params: { user1Id, user2Id }
        }
      )
      .one();
  }

  return null; // Edge already exists
};

const unmuteUser = async (session, userId1, userId2) => {
  return await session
    .command(
      `
    DELETE EDGE Mutes 
    WHERE out.userId = :userId1 
    AND in.userId = :userId2
  `,
      { params: { userId1, userId2 } }
    )
    .all();
};

const blockUser = async (session, user1Id, user2Id) => {
  const existingEdge = await session
    .query(`SELECT FROM Blocks WHERE out = :user1Id AND in = :user2Id`, {
      params: { user1Id, user2Id }
    })
    .one();

  if (!existingEdge) {
    return await session
      .command(
        `CREATE EDGE Blocks FROM (SELECT FROM V WHERE @rid = :user1Id) TO (SELECT FROM V WHERE @rid = :user2Id)`,
        {
          params: { user1Id, user2Id }
        }
      )
      .one();
  }

  return null; // Edge already exists
};

const unblockUser = async (session, userId1, userId2) => {
  return await session
    .command(
      `
    DELETE EDGE Blocks 
    WHERE out.userId = :userId1 
    AND in.userId = :userId2
  `,
      { params: { userId1, userId2 } }
    )
    .all();
};

module.exports = {
  createUser,
  findUser,
  followUser,
  unfollowUser,
  muteUser,
  unmuteUser,
  blockUser,
  unblockUser
};
