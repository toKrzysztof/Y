// src/composables/useUserActions.ts
import { ref, type Component } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config/env';
import {
  addUserFollowed,
  isUserBlocked,
  isUserFollowed,
  isUserMuted
} from '../utils/localStorageUtils';
import UserActionModalContentComponent from '../components/UserActionModalContentComponent.vue';

export function useUserActions(
  openModal: (title: string, content: Component, props: unknown) => Promise<unknown>,
  username: string
) {
  const userFollowed = ref(isUserFollowed(username));
  const userBlocked = ref(isUserBlocked(username));
  const userMuted = ref(isUserMuted(username));

  const userAction = async (
    actionName: 'follow' | 'block' | 'mute',
    actionType: 'delete' | 'add',
    username: string
  ) => {
    if (actionName === 'follow' && actionType === 'add') {
      axios
        .post(`${API_URL}/user/${actionName}/${username}`)
        .then(() => {
          addUserFollowed(username);
          userFollowed.value = !userFollowed.value;
        })
        .catch((e) => {
          console.log(e);
        });
      return;
    }
    const actionPrefix = actionType === 'delete' ? 'un' : '';
    return openModal(
      `Are you sure you want to ${actionPrefix}${actionName} ${username}?`,
      UserActionModalContentComponent,
      { actionName, actionType, username }
    ).then((res) => {
      if (res === 'confirm-action') {
        switch (actionName) {
          case 'block':
            userBlocked.value = !userBlocked.value;
            break;
          case 'mute':
            userMuted.value = !userMuted.value;
            break;
          case 'follow':
            userFollowed.value = !userFollowed.value;
            break;
        }
      }

      return res;
    });
  };

  return {
    userAction,
    userFollowed,
    userBlocked,
    userMuted
  };
}
