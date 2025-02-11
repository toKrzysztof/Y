class PostPublisher {
  constructor() {
    this.subscribers = [];
  }

  publishNewPost(newPost) {
    this.subscribers.forEach((subscriber) => {
      subscriber.callback(newPost);
    });
  }

  subscribe(userId, callback) {
    this.subscribers.push({ userId, callback });
  }

  unsubscribe(userId) {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber.userId !== userId
    );
  }
}

const postPublisher = new PostPublisher({ messages: [], users: [] });

module.exports = { postPublisher };
