<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '@/modules/user/models/user-model';
import { API_URL } from '@/config/env';
import axios from 'axios';
import UserCardComponent from './UserCardComponent.vue';
import { removeUserBlocked } from '../utils/localStorageUtils';

const blockedUsersList = ref<User[]>((await axios.get(`${API_URL}/user/block`)).data);

const unblockUser = (username: string) => {
  const filteredUsers = blockedUsersList.value.filter(
    (user) => user.username !== username
  );
  blockedUsersList.value = filteredUsers;
  axios
    .delete(`${API_URL}/user/block/${username}`)
    .then(() => {
      removeUserBlocked(username);
    })
    .catch((e) => console.log(e));
};
</script>

<template>
  <h2>Blocked users:</h2>
  <div v-show="blockedUsersList.length === 0">No users blocked.</div>
  <ul class="blocked-users-list" v-if="blockedUsersList.length > 0">
    <li v-for="user in blockedUsersList" v-bind:key="user.id" class="flex">
      <UserCardComponent :user="user"></UserCardComponent
      ><button
        class="button-small button-primary"
        @click="() => unblockUser(user.username)"
      >
        Unblock
      </button>
    </li>
  </ul>
</template>
<style lang="scss" scoped>
.blocked-users-list {
  @extend %reset-ordered-list;
}

.flex {
  align-items: center;
  display: flex;
  gap: 0.5rem;
}
</style>
