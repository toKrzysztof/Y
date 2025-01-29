const { injectRid } = require('../orientjs/db-query-param-injectors');

const createPost = async (session, title, content, links, userId, username) => {
  const post = await session
    .command(
      'INSERT INTO Post SET username = :username, title = :title, content = :content, createdAt = :now, updatedAt = :now, links = :links',
      { params: { title, content, now: new Date(), links, username } }
    )
    .one();

  await session
    .command(
      'CREATE EDGE HasPost FROM (SELECT FROM User WHERE @rid = :userId) TO :postId',
      { params: { userId, postId: post['@rid'] } }
    )
    .one();

  return post;
};

const updatePost = async (session, postId, title, content) => {
  return await session
    .command(
      'UPDATE Post SET title = :title, content = :content, updatedAt = :now WHERE @rid = :postId',
      { params: { title, content, now: new Date(), postId } }
    )
    .one();
};

// Delete post with comments
const deletePost = async (session, postId) => {
  await session.command(
    'DELETE VERTEX FROM (SELECT expand(tree(0)) FROM (SELECT FROM Post WHERE @rid = :postId))',
    { params: { postId } }
  );
};

const getPostsMadeByUser = async (session, userId, skip, limit) => {
  return (
    (await session
      .query(
        `SELECT LIST(*) as content, COUNT(*) as count FROM (SELECT username, firstName, lastName, postId, title, content, createdAt, updatedAt, if(eval("comments[0].id IS NULL"), [], comments) as comments
      FROM (MATCH {Class: User, as: user, where: (@rid = :userId)}-HasPost->{Class: Post, as: post}-HasComment->{Class: Comment, as: comment, optional: true}
      RETURN
      user.username as username,
      user.firstName as firstName,
      user.lastName as lastName,
      post.@rid as postId,
      post.title as title,
      post.content as content,
      post.createdAt as createdAt,
      post.updatedAt as updatedAt,
      set({
                "id": comment.@rid,
                "createdAt": comment.createdAt,
                "content": comment.content,
                "updatedAt": comment.updatedAt,
                "username": comment.username
            }) AS comments
        GROUP BY postId
) GROUP BY createdAt ORDER BY createdAt DESC SKIP :skip LIMIT :limit)`,
        { params: { userId, skip: parseInt(skip), limit: parseInt(limit) } }
      )
      .one()) || { count: 0, content: [] }
  );
};

const getPostsOfFollowedUsers = async (session, userId, skip, limit) => {
  // crashes whole db connection but works in db gui client :-)
  //   return (
  //     (await session
  //       .query(
  //         `SELECT LIST(*) as content, COUNT(*) as count FROM (SELECT username, firstName, lastName, postId, title, content, createdAt, updatedAt, if(eval("comments[0].id IS NULL"), [], comments) as comments
  //       FROM (MATCH {Class: User, as: user, where: (@rid = :userId)}-Follows->{Class: User, as: follow}-HasPost->{Class: Post, as: post}-HasComment->{Class: Comment, as: comment, optional: true}<-MadeComment-{Class: User, as: commentAuthor}
  //       RETURN
  //       follow.username as username,
  //       follow.firstName as firstName,
  //       follow.lastName as lastName,
  //       post.@rid as postId,
  //       post.title as title,
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
  return (
    (await session
      .query(
        `SELECT LIST(*) as content, COUNT(*) as count FROM (SELECT username, firstName, lastName, postId, title, content, createdAt, updatedAt, if(eval("comments[0].id IS NULL"), [], comments) as comments
        FROM (MATCH {Class: User, as: user, where: (@rid = :userId)}-Follows->{Class: User, as: follow}-HasPost->{Class: Post, as: post}-HasComment->{Class: Comment, as: comment, optional: true}
        RETURN
        follow.username as username,
        follow.firstName as firstName,
        follow.lastName as lastName,
        post.@rid as postId,
        post.title as title,
        post.content as content,
        post.createdAt as createdAt,
        post.updatedAt as updatedAt,
        set({
                  "id": comment.@rid,
                  "createdAt": comment.createdAt,
                  "content": comment.content,
                  "updatedAt": comment.updatedAt,
                  "username": comment.username
              }) AS comments
          GROUP BY postId
  ) GROUP BY createdAt ORDER BY createdAt DESC SKIP :skip LIMIT :limit)`,
        { params: { userId, skip: parseInt(skip), limit: parseInt(limit) } }
      )
      .one()) || { count: 0, content: [] }
  );
};

// Get Post with Comments 1 level deep
const getRandomPostsWithFirstLevelComments = async (session, userId, limit) => {
  const totalRecords = await session
    .query(`SELECT COUNT(*) as totalRecords FROM Post`)
    .one();

  // Doing this at this layer, because other dbs have RAND() function which would normally be used inside the query
  const randomOffset =
    totalRecords.totalRecords - limit <= 0
      ? 0
      : Math.floor(Math.random() * (totalRecords.totalRecords - limit));

  const query = injectRid(
    `SELECT *, if(eval("comments[0].id IS NULL"), [], comments) as comments
      FROM (
        MATCH
            {Class: User, as: author}-HasPost->{Class: Post, as: post}-HasComment->{Class: Comment, as: comment, optional: true}
        RETURN
            post.@rid AS postId,
            post.createdAt AS createdAt,
            post.title AS title,
            post.content AS content,
            post.updatedAt AS updatedAt,
            author.username as username,
            author.firstName as firstName,
            author.lastName as lastName,
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
    'userId',
    userId
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
  getRandomPostsWithFirstLevelComments
};
