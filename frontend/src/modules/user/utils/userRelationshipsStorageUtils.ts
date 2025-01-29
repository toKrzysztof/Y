export const isUserFollowed = (username: string) => {
  const followedUser = JSON.parse(localStorage.getItem('followedUsers') ?? '[{}]').find(
    (user) => user.username === username
  );

  return followedUser ? true : false;
};

export const addUserFollowed = (username: string) => {
  const followedUsers = JSON.parse(localStorage.getItem('followedUsers') ?? '[{}]');

  followedUsers.push({ username });
  localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
};

export const removeUserFollowed = (username: string) => {
  const followedUsers = JSON.parse(
    localStorage.getItem('followedUsers') ?? '{}'
  ).filter((user) => user.username !== username);

  localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
};

export const isUserBlocked = (username: string) => {
  const blockedUser = JSON.parse(localStorage.getItem('blockedUsers') ?? '[{}]').find(
    (user) => user.username === username
  );

  return blockedUser ? true : false;
};

export const addUserBlocked = (username: string) => {
  const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') ?? '[{}]');

  blockedUsers.push({ username });
  localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
};

export const removeUserBlocked = (username: string) => {
  const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') ?? '{}').filter(
    (user) => user.username !== username
  );

  localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
};
