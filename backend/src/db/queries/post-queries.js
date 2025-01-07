const createPost = async (session, title, content, userId) => {
  const post = await session
    .command(
      'INSERT INTO Post SET title = :title, content = :content, createdAt = :now, updatedAt = :now',
      { params: { title, content, now: new Date() } }
    )
    .one();

  await session
    .command('CREATE EDGE HasPost FROM :userId TO :postId', {
      params: { userId, postId: post['@rid'] }
    })
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

module.exports = {
  createPost,
  updatePost,
  deletePost
};
