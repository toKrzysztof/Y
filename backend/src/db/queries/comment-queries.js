const createComment = async (session, { content, userId, parentId, parentType }) => {
  const comment = await session
    .command(
      'INSERT INTO Comment SET content = :content, userId = :userId, createdAt = :now, updatedAt = :now',
      { params: { content, userId, now: new Date() } }
    )
    .one();

  await session
    .command(
      'CREATE EDGE HasComment FROM (SELECT FROM :parentType WHERE @rid = :parentId) TO (SELECT FROM Comment WHERE @rid = :commentId)',
      { params: { parentType, parentId, commentId: comment['@rid'] } }
    )
    .one();

  return comment;
};

const updateComment = async (session, commentId, { content }) => {
  return await session
    .command(
      'UPDATE Comment SET content = :content, updatedAt = :now WHERE @rid = :commentId',
      { params: { content, now: new Date(), commentId } }
    )
    .one();
};

const getCommentTree = async (session, commentId) => {
  return await session
    .query(
      `
    SELECT expand(tree(0)) 
    FROM (
      SELECT FROM Comment 
      WHERE @rid = :commentId
    )
  `,
      { params: { commentId } }
    )
    .all();
};

// Delete comment with subcomments
const deleteComment = async (session, commentId) => {
  await session.command(
    'DELETE VERTEX FROM (SELECT expand(tree(0)) FROM (SELECT FROM Comment WHERE @rid = :commentId))',
    { params: { commentId } }
  );
};

module.exports = {
  createComment,
  updateComment,
  getCommentTree,
  deleteComment
};
