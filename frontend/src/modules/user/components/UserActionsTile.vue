<script setup lang="ts">
import { API_URL } from '@/config/env';
import axios from 'axios';
import { ref } from 'vue';
import {
  addUserBlocked,
  addUserFollowed,
  isUserBlocked,
  isUserFollowed,
  removeUserBlocked,
  removeUserFollowed
} from '../utils/userRelationshipsStorageUtils';

const props = defineProps<{ username: string }>();
const ownUsername = localStorage.getItem('username');
const userFollowed = ref(isUserFollowed(props.username));
const userBlocked = ref(isUserBlocked(props.username));

const follow = (username: string) => {
  userFollowed.value = true;
  axios
    .post(`${API_URL}/user/follow/${username}`)
    .then(() => {
      addUserFollowed(username);
    })
    .catch((e) => {
      console.log(e);
      userFollowed.value = false;
    });
};

const unfollow = (username: string) => {
  userFollowed.value = false;
  axios
    .delete(`${API_URL}/user/follow/${username}`)
    .then(() => {
      removeUserFollowed(username);
    })
    .catch((e) => {
      console.log(e);
      userFollowed.value = true;
    });
};

const block = (username: string) => {
  userBlocked.value = true;
  axios
    .post(`${API_URL}/user/block/${username}`)
    .then(() => {
      addUserBlocked(username);
    })
    .catch((e) => {
      console.log(e);
      userBlocked.value = false;
    });
};

const unblock = (username: string) => {
  userBlocked.value = false;
  axios
    .delete(`${API_URL}/user/block/${username}`)
    .then(() => {
      removeUserBlocked(username);
    })
    .catch((e) => {
      console.log(e);
      userBlocked.value = true;
    });
};
</script>
<template>
  <div class="user-actions-tile">
    <span class="user-comment-author-username">{{ username }}</span>

    <button
      v-if="!userFollowed && username !== ownUsername"
      @click="() => follow(username)"
      class="button-small"
    >
      follow
    </button>
    <button
      v-if="userFollowed && username !== ownUsername"
      @click="() => unfollow(username)"
      class="button-small"
    >
      unfollow
    </button>
    <button
      v-if="!userBlocked && username !== ownUsername"
      @click="() => block(username)"
      class="button-small"
    >
      block
    </button>
    <button
      v-if="userBlocked && username !== ownUsername"
      @click="() => unblock(username)"
      class="button-small"
    >
      unblock
    </button>
  </div>
</template>
<style lang="scss" scoped>
.user-comment-author-username {
  font-weight: 700;
}

.user-actions-tile {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
