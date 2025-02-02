const { injectRids } = require('../orientjs/db-query-param-injectors');

const createPost = async (session, content, userId, parentId = null) => {
  const post = await session
    .command(
      'CREATE VERTEX Post SET content = :content, createdAt = :now, updatedAt = :now',
      { params: { content, now: new Date() } }
    )
    .one();

  if (parentId !== null) {
    await session
      .command(
        injectRids('CREATE EDGE HasReply FROM :parentId to :postId', {
          parentId,
          postId: post['@rid']
        })
      )
      .one();
  }

  await session
    .command(
      injectRids('CREATE EDGE HasPost FROM :userId TO :postId', {
        userId,
        postId: post['@rid']
      })
    )
    .one();

  return post;
};

const updatePost = async (session, postId, content) => {
  return await session
    .command(
      'UPDATE Post SET, content = :content, updatedAt = :now WHERE @rid = :postId',
      { params: { content, now: new Date(), postId } }
    )
    .one();
};

// Delete post with comments
const deletePost = async (session, postId) => {
  await session.command(
    injectRids('DELETE VERTEX FROM (SELECT expand(tree(0)) FROM :postId', { postId })
  );
};

const getPostsMadeByUser = async (session, userId, skip, limit) => {
  // returns 0 even though there are records
  // const totalRecords = await session
  //   .query(
  //     `SELECT COUNT(*) as totalRecords FROM Post WHERE in('HasPost').@rid = :userId`,
  //     { params: { userId } }
  //   )
  //   .one();

  const totalRecords = await session
    .query(
      injectRids(
        `SELECT COUNT(*) as totalRecords FROM Post WHERE in('HasPost').@rid = :userId`,
        { userId }
      )
    )
    .one();

  const content = await session
    .query(
      `MATCH {Class: User, as: user, where: (@rid = :userId)}-HasPost->{Class: Post, as: post}-HasReply->{Class: Post, as: reply, optional: true}
      RETURN
      user.username as username,
      user.name as name,
      post.@rid as postId,
      post.content as content,
      post.createdAt as createdAt,
      post.updatedAt as updatedAt,
      post.links as links
      GROUP BY createdAt ORDER BY createdAt DESC SKIP :skip LIMIT :limit`,
      { params: { userId, skip: parseInt(skip), limit: parseInt(limit) } }
    )
    .all();

  return { count: totalRecords.totalRecords, content: content };
};

const getPostsOfFollowedUsers = async (session, userId, skip, limit) => {
  const totalRecords = await session
    .query(
      injectRids(
        `MATCH {Class: User, as: user, where: (@rid = :userId)}-Follows->{Class: User, as: follow}-HasPost->{Class: Post, as: post} RETURN COUNT(*) as totalRecords`,
        { userId }
      )
    )
    .one();

  // crashes whole db connection but works in db gui client :-)
  //   return (
  //     (await session
  //       .query(
  //         `SELECT LIST(*) as content, COUNT(*) as count FROM (SELECT username, firstName, lastName, postId, content, createdAt, updatedAt, if(eval("comments[0].id IS NULL"), [], comments) as comments
  //       FROM (MATCH {Class: User, as: user, where: (@rid = :userId)}-Follows->{Class: User, as: follow}-HasPost->{Class: Post, as: post}-HasComment->{Class: Comment, as: comment, optional: true}<-MadeComment-{Class: User, as: commentAuthor}
  //       RETURN
  //       follow.username as username,
  //       follow.firstName as firstName,
  //       follow.lastName as lastName,
  //       post.@rid as postId,
  //       post.content as content,
  //       post.createdAt as createdAt,
  //       post.updatedAt as updatedAt,
  //       set({
  //                 "id": comment.@rid,
  //                 "createdAt": comment.createdAt,
  //                 "content": comment.content,
  //                 "updatedAt": comment.updatedAt,
  //                 "username": comment.username,
  //                 "follows": commentAuthor.in("Follows") as follows
  //             }) AS comments
  //         GROUP BY postId
  // ) GROUP BY createdAt ORDER BY createdAt DESC SKIP :skip LIMIT :limit)`,
  //         { params: { userId, skip: parseInt(skip), limit: parseInt(limit) } }
  //       )
  //       .one()) || { count: 0, content: [] }
  //   );

  // const content = await session
  //   .query(
  //     `SELECT username, firstName, lastName, postId, content, createdAt, updatedAt, links, if(eval("replies[0].id IS NULL"), [], replies) as replies
  //       FROM (MATCH {Class: User, as: user, where: (@rid = :userId)}-Follows->{Class: User, as: follow}-HasPost->{Class: Post, as: post}-HasReply->{Class: Post, as: reply, optional: true}
  //       RETURN
  //       follow.username as username,
  //       follow.firstName as firstName,
  //       follow.lastName as lastName,
  //       post.@rid as postId,
  //       post.content as content,
  //       post.createdAt as createdAt,
  //       post.updatedAt as updatedAt,
  //       post.links AS links,
  //       set({
  //                 "id": reply.@rid,
  //                 "createdAt": reply.createdAt,
  //                 "content": reply.content,
  //                 "updatedAt": reply.updatedAt,
  //                 "username": reply.username
  //             }) AS replies
  //         GROUP BY postId
  // ) GROUP BY createdAt ORDER BY createdAt DESC SKIP :skip LIMIT :limit`,
  //     { params: { userId, skip: parseInt(skip), limit: parseInt(limit) } }
  //   )
  //   .all();

  const content = await session
    .query(
      injectRids(
        `MATCH {Class: User, as: user, where: (@rid = :userId)}-Follows->{Class: User, as: follow}-HasPost->{Class: Post, as: post}<-HasReply-{Class: Post, as: parentPost, optional: true}<-HasPost-{Class: User, as: parentPostAuthor, optional: true}
        RETURN
        follow.username as authorUsername,
        follow.name as authorName,
        post.@rid as postId,
        post.content as content,
        post.createdAt as createdAt,
        post.updatedAt as updatedAt,
        post.links AS links,
        parentPost.@rid as parentPostId, parentPostAuthor.username as parentPostAuthorUsername
        GROUP BY createdAt ORDER BY createdAt DESC SKIP :skip LIMIT :limit`,
        { userId }
      ),
      { params: { skip: parseInt(skip), limit: parseInt(limit) } }
    )
    .all();

  return { count: totalRecords.totalRecords, content: content };
};

// Get Post with Comments 1 level deep
const getNewestPosts = async (session, skip, limit) => {
  // blocked users' posts filtered
  // const totalRecords = await session.query(
  //   "SELECT FROM POST WHERE first(in(HasPost).@rid) NOT IN (SELECT out('Blocks') FROM #userId"
  // );

  console.log();

  const totalRecords = await session
    .query('SELECT COUNT(*) as totalRecords FROM POST')
    .one();

  // blocked users' posts filtered
  //   const posts = await session
  //     .query(
  //       `SELECT FROM (MATCH {Class: User, as: user}-HasPost->{Class: Post, as: post}<-HasReply-{Class: Post, as: parentPost, optional: true}<-HasPost-{Class: User, as: parentPostAuthor, optional: true}
  // RETURN post.content as content, post.createdAt as createdAt, post.links as links, user.username as authorUsername, user.@rid as authorId, parentPostAuthor.username as parentPostAuthorUsername)
  // WHERE authorId NOT IN (select out('Blocks') FROM #83:0)`,
  //       { params: { skip, limit } }
  //     )
  //     .all();

  const posts = await session
    .query(
      `MATCH {Class: User, as: user}-HasPost->{Class: Post, as: post}<-HasReply-{Class: Post, as: parentPost, optional: true}<-HasPost-{Class: User, as: parentPostAuthor, optional: true}
RETURN post.@rid as id, post.content as content, post.createdAt as createdAt, post.links as links, user.username as authorUsername, user.name as authorName, parentPost.@rid as parentPostId, parentPostAuthor.username as parentPostAuthorUsername GROUP BY id ORDER BY createdAt DESC SKIP :skip LIMIT :limit`,
      { params: { skip: parseInt(skip), limit: parseInt(limit) } }
    )
    .all();

  return { count: totalRecords.totalRecords, content: posts };
};

const getNewestPostsWithFirstLevelReplies = async (session, userId, skip, limit) => {
  const totalRecords = await session
    .query(`SELECT COUNT(*) as totalRecords FROM Post`)
    .one();

  // Doing this at this layer, because other dbs have RAND() function which would normally be used inside the query
  const randomOffset =
    totalRecords.totalRecords - limit <= 0
      ? 0
      : Math.floor(Math.random() * (totalRecords.totalRecords - limit));

  const query = injectRids(
    `SELECT *, if(eval("comments[0].id IS NULL"), [], comments) as comments
      FROM (
        MATCH
            {Class: User, as: author}-HasPost->{Class: Post, as: post}-HasComment->{Class: Comment, as: comment, optional: true}
        RETURN
            post.@rid AS postId,
            post.createdAt AS createdAt,
            post.content AS content,
            post.updatedAt AS updatedAt,
            post.links AS links,
            author.username as username,
            author.name as name,
            set({
                "id": comment.@rid,
                "createdAt": comment.createdAt,
                "content": comment.content,
                "updatedAt": comment.updatedAt,
                "username": comment.username
            }) AS comments
        GROUP BY postId
      )
      WHERE (authorId NOT IN (SELECT EXPAND( $combined ) LET $blockdBy = ( SELECT out as block FROM Blocks WHERE in=:userId ), $blocks = ( SELECT in as block FROM Blocks where out=:userId ), $combined = UNIONALL( $blockdBy, $blocks ))) SKIP :skip LIMIT :limit`,
    { userId }
  );

  const posts = await session
    .query(query, {
      params: { skip: randomOffset, limit }
    })
    .all();

  return { content: posts, count: totalRecords.totalRecords };
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostsMadeByUser,
  getPostsOfFollowedUsers,
  getNewestPosts
};
