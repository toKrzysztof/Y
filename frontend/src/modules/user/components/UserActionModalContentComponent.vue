<script setup lang="ts">
import { API_URL } from '@/config/env';
import axios from 'axios';
import { inject } from 'vue';
import {
  addUserBlocked,
  addUserMuted,
  removeUserBlocked,
  removeUserFollowed,
  removeUserMuted
} from '../utils/localStorageUtils';
import type { InfiniteScrollControls } from './InfiniteScrollPageComponent.vue';

export interface UserActionsModalProps {
  props: {
    actionName: 'follow' | 'block' | 'mute';
    actionType: 'delete' | 'add';
    username: string;
  };
}
const props = defineProps<UserActionsModalProps>();

const rerenderPosts = inject<InfiniteScrollControls>(
  'infiniteScrollControls'
)?.triggerReRender;

const rerenderUserActions =
  inject<InfiniteScrollControls>('UserActionControls')?.triggerReRender;

const closeModal = inject<(props?: unknown) => void>('closeModal');

const userActionsMapping = {
  follow: (username: string, actionType: 'delete' | 'add') => {
    if (actionType === 'delete') {
      removeUserFollowed(username);
    }
  },
  block: (username: string, actionType: 'delete' | 'add') => {
    if (actionType === 'add') {
      addUserBlocked(username);
    } else if (actionType === 'delete') {
      removeUserBlocked(username);
    }
  },
  mute: (username: string, actionType: 'delete' | 'add') => {
    if (actionType === 'add') {
      addUserMuted(username);
    } else if (actionType === 'delete') {
      removeUserMuted(username);
    }
  }
};

const userAction = (
  actionName: 'follow' | 'block' | 'mute',
  actionType: 'delete' | 'add',
  username: string
) => {
  if (actionType === 'add') {
    axios
      .post(`${API_URL}/user/${actionName}/${username}`)
      .then(() => {
        userActionsMapping[actionName](username, actionType);
        if (rerenderPosts !== undefined) {
          rerenderPosts();
        }
        if (rerenderUserActions !== undefined) {
          rerenderUserActions();
        }
        if (closeModal !== undefined) {
          closeModal('confirm-action');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  } else if (actionType === 'delete') {
    axios
      .delete(`${API_URL}/user/${actionName}/${username}`)
      .then(() => {
        userActionsMapping[actionName](username, actionType);
        if (rerenderPosts !== undefined) {
          rerenderPosts();
        }
        if (rerenderUserActions !== undefined) {
          rerenderUserActions();
        }
        if (closeModal !== undefined) {
          closeModal('confirm-action');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
};
</script>
<template>
  <div class="buttons-box">
    <button
      class="button-secondary"
      @click="
        () =>
          userAction(
            props.props.actionName,
            props.props.actionType,
            props.props.username
          )
      "
    >
      Yes
    </button>
    <button class="button-primary" @click="closeModal">No</button>
  </div>
</template>
<style lang="scss" scoped>
.buttons-box {
  display: flex;
  justify-content: center;
  gap: 3rem;
}
</style>
