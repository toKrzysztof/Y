interface localStorageUser {
  id: string;
  username: string;
  name: string;
}

export const isUserFollowed = (username: string) => {
  const followedUser = JSON.parse(localStorage.getItem('followedUsers') ?? '[{}]').find(
    (user: localStorageUser | null) => user?.username === username
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
  ).filter((user: localStorageUser | null) => user?.username !== username);

  localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
};

export const isUserMuted = (username: string) => {
  const mutedUser = JSON.parse(localStorage.getItem('mutedUsers') ?? '[{}]').find(
    (user: localStorageUser | null) => user?.username === username
  );

  return mutedUser ? true : false;
};

export const addUserMuted = (username: string) => {
  const mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') ?? '[{}]');

  mutedUsers.push({ username });
  localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
};

export const removeUserMuted = (username: string) => {
  const mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') ?? '{}').filter(
    (user: localStorageUser | null) => user?.username !== username
  );

  localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
};

export const isUserBlocked = (username: string) => {
  const blockedUser = JSON.parse(localStorage.getItem('blockedUsers') ?? '[{}]').find(
    (user: localStorageUser | null) => user?.username === username
  );

  return blockedUser ? true : false;
};

export const addUserBlocked = (username: string) => {
  const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') ?? '[{}]');

  blockedUsers.push({ username });
  removeUserFollowed(username);
  localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
};

export const removeUserBlocked = (username: string) => {
  const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') ?? '{}').filter(
    (user: localStorageUser | null) => user?.username !== username
  );

  localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
};

export const setLoggedInUserState = (
  userId: string,
  name: string,
  username: string,
  followedUsers: string,
  blockedUsers: string,
  mutedUsers: string
) => {
  localStorage.setItem('userId', userId);
  localStorage.setItem('name', name);
  localStorage.setItem('username', username);
  localStorage.setItem('followedUsers', followedUsers);
  localStorage.setItem('blockedUsers', blockedUsers);
  localStorage.setItem('mutedUsers', mutedUsers);
};
