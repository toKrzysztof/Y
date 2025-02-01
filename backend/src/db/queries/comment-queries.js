// const { serializeRids } = require('../orientjs/db-helpers');
// const { injectRid } = require('../orientjs/db-query-param-injectors');

// const findComment = async (session, commentId) => {
//   const query = injectRid(
//     'SELECT @rid as id, content, createdAt, username FROM :commentId',
//     'commentId',
//     commentId
//   );
//   return await session.query(query).one();
// };

// // TODO - flip username and parentId, should be parendAuthorUsername and userId
// const createComment = async (session, content, userId, parentId, username) => {
//   const comment = await session
//     .command(
//       'CREATE VERTEX Comment SET username = :username, content = :content, createdAt = :now, updatedAt = :now',
//       { params: { content, userId, now: new Date(), username } }
//     )
//     .one();

//   await session
//     .command(
//       injectRid('CREATE EDGE MadeComment FROM :userId TO :commentId', 'userId', userId),
//       {
//         params: { commentId: comment['@rid'] }
//       }
//     )
//     .one();

//   await session
//     .command(
//       injectRid(
//         'CREATE EDGE HasComment FROM :parentId TO :commentId',
//         'parentId',
//         parentId
//       ),
//       { params: { commentId: comment['@rid'] } }
//     )
//     .one();

//   return comment;
// };

// const updateComment = async (session, commentId, content) => {
//   return await session
//     .command(
//       'UPDATE Comment SET content = :content, updatedAt = :now WHERE @rid = :commentId',
//       { params: { content, now: new Date(), commentId } }
//     )
//     .one();
// };

// // Delete comment with subcomments (orientdb deletes edges automatically when deleting vertices)
// const deleteComment = async (session, commentId) => {
//   // The parameterized query
//   const query = injectRid(
//     `SELECT @rid as id, content FROM (TRAVERSE out('HasComment') FROM :commentId WHILE $depth >= 0)`,
//     'commentId',
//     commentId
//   );

//   const commentIds = await session
//     .query(query)
//     .all()
//     .map((record) => record.id);

//   const serializedCommentIds = serializeRids(commentIds);

//   // WORKS
//   await session
//     .delete('VERTEX', 'Comment')
//     .where('@rid IN :commentRids')
//     .one({ commentRids: serializedCommentIds });

//   // DOESNT WORK - count: 0
//   // const deleted = await session
//   //   .command('DELETE VERTEX Comment WHERE @rid IN ?', [serializedCommentIds])
//   //   .one();

//   // DOESNT WORK - commentId parsing error "Class x not found", commentId = <existing class rid>
//   // const comments = await session
//   //   .query(
//   //     `SELECT @rid as id FROM (TRAVERSE out('HasComment') FROM :commentId WHILE $depth >= 0)`,
//   //     { params: { commentId } }
//   //   )
//   //   .all();

//   // DOESNT WORK - commentId parsing error "Class x not found", commentId = <existing class rid>
//   // const comments = await session
//   //   .command(
//   //     `SELECT @rid as id FROM (TRAVERSE out('HasComment') FROM :commentId WHILE $depth >= 0)`,
//   //     { params: { commentId } }
//   //   )
//   //   .all();

//   // WORKS, commentId = <existing class rid>
//   // const comments = await session.select().from(commentId).all();

//   // WORKS, userId = <existing user rid>
//   // const comments = await session
//   //   .select()
//   //   .from('User')
//   //   .where('@rid = :userId')
//   //   .all({ userId: '#60:1' });

//   // SQL INJECTION ATTEMPT - returns empty array even when there would be data
//   // const comments = await session
//   //   .select()
//   //   .from('User')
//   //   .where('@rid = :userId')
//   //   .all({ userId: '#60:1 OR 1=1' });

//   // SQL INJECTION ATTEMPT - returns empty array even when there would be data
//   // const comments = await session
//   //   .select()
//   //   .from('User')
//   //   .where('@rid = :userId')
//   //   .all({ userId: '#60:1 OR @rid = #57:1' });

//   return commentIds;
// };

// // TODO - exclude comments from blocked users (maybe)
// const getCommentReplies = async (session, commentId, limit, skip) => {
//   const totalRecords = await session
//     .query(
//       `MATCH {Class: Comment, as: comment, where: (@rid = :commentId)}-HasComment->{Class: Comment, as: reply} return COUNT(*) as totalRecords`,

//       { params: { commentId, skip: parseInt(skip), limit: parseInt(limit) } }
//     )
//     .one();

//   const content = await session
//     .query(
//       `MATCH {Class: Comment, as: comment, where: (@rid = :commentId)}-HasComment->{Class: Comment, as: reply}<-MadeComment-{Class: User, as: user}
//     RETURN
//     reply.@rid as id,
//     reply.createdAt as createdAt,
//     reply.updatedAt as updatedAt,
//     reply.content as content,
//     reply.username as username,
//     user.in("Follows") as follows
//     GROUP BY createdAt ORDER BY createdAt DESC
//     SKIP :skip LIMIT :limit
//   `,
//       { params: { commentId, skip: parseInt(skip), limit: parseInt(limit) } }
//     )
//     .all();

//   return { content, count: totalRecords.totalRecords };
// };

// module.exports = {
//   findComment,
//   createComment,
//   updateComment,
//   getCommentReplies,
//   deleteComment
// };
