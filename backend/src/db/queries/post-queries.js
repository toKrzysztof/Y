const createPost = async (session, title, content, links, userId) => {
  const post = await session
    .command(
      'INSERT INTO Post SET title = :title, content = :content, createdAt = :now, updatedAt = :now, links = :links',
      { params: { title, content, now: new Date(), links } }
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
      `MATCH {Class: User, as: user, where: (@rid = :userId)}-Follows->{Class: User, as: folowee}-HasPost->{Class: Post, as: post}
      RETURN
      folowee.@rid as authorId,
      folowee.firstName as authorFirstName,
      folowee.lastName as authorLastName,
      post.@rid as postId,
      post.title as title,
      post.content as content,
      post.createdAt as createdAt,
      post.updatedAt as updatedAt`,
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
  createPost,
  updatePost,
  deletePost,
  getPostsMadeByUser,
  getPostsOfFollowees,
  getPostsWithFirstLevelComments
};
