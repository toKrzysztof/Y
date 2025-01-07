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

const getPostsMadeByUser = async (session, userId) => {
  return await session
    .query(
      `SELECT @rid, createdAt, title, content, updatedAt FROM(SELECT expand(out('HasPost')) FROM User WHERE @rid=:userId)`,
      { params: { userId } }
    )
    .all();
};

const getPostsOfFollowees = async (session, userId) => {
  return await session
    .query(
      `MATCH {Class: User, as: user, where: (@rid = :userId)}-Follows->{Class: User, as: friend}-HasPost->{Class: Post, as: post}
      RETURN
      friend.@rid as authorId,
      friend.firstName as authorFirstName,
      friend.lastName as authorLastName,
      set({
        "id": post.@rid,
        "title": post.title,
        "content": post.content,
        "createdAt": post.createdAt,
        "updatedAt": post.updatedAt
      }) as posts
      GROUP BY authorId`,
      { params: { userId } }
    )
    .all();
};

// Get Post with Comments 1 level deep
const getPostsWithFirstLevelComments = async (session, userId) => {
  return await session
    .query(
      `SELECT *, if(eval("comments[0].commentId IS NULL"), list(), comments) as comments
      FROM (
        MATCH 
            {Class: User, as: author}-HasPost->{Class: Post, as: post}-HasComment->{Class: Comment, as: comment, optional: true}
        RETURN 
            post.@rid AS postId,
            post.createdAt AS postCreatedAt,
            post.title AS postTitle,
            post.content AS postContent,
            post.updatedAt AS postUpdatedAt,
            author.@Rid as authorId,
            set({ 
                "commentId": comment.@rid, 
                "createdAt": comment.createdAt, 
                "content": comment.content, 
                "updatedAt": comment.updatedAt, 
                "userId": comment.userId 
            }) AS comments
        GROUP BY postId
      )
      WHERE (authorId NOT IN (SELECT EXPAND( $combined ) LET $blockdBy = ( SELECT out as block FROM Blocks WHERE in=:userId ), $blocks = ( SELECT in as block FROM Blocks where out=:userId ), $combined = UNIONALL( $blockdBy, $blocks )))`,
      { params: { userId } }
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
  unblockUser,
  getPostsOfFollowees,
  getPostsWithFirstLevelComments,
  getPostsMadeByUser
};
