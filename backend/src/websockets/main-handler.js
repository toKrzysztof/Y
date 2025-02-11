const { acquireDbSession, closeDbSession } = require('../db/db-tools');
const { serializeRid } = require('../db/orientjs/db-helpers');
const { findPost } = require('../db/queries/post-queries');
const { getUserDetails } = require('../db/queries/user-queries');
const { dbSessionPool } = require('../server');
const { postPublisher } = require('./publishers/postPublisher');

const mainWebsocketHandler = async (socket) => {
  const { userId, username } = socket;

  socket.on('listen-for-posts', (msg) => {
    postPublisher.subscribe(userId, async (newPost) => {
      try {
        const session = await acquireDbSession(await dbSessionPool);
        // const data = await getUserDetails(session, username);
        const postId = serializeRid(newPost['@rid']);
        const post = await findPost(session, postId);
        closeDbSession(session);
        socket.emit('new-post', post);
      } catch (e) {
        console.log(e);
      }
    });
  });

  socket.on('disconnect', () => {
    postPublisher.unsubscribe(userId);
    console.log('A user disconnected');
  });
};

module.exports = { mainWebsocketHandler };
