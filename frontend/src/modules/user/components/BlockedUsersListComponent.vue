<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '@/modules/user/models/user-model';
import { API_URL } from '@/config/env';
import axios from 'axios';
import UserCardComponent from './UserCardComponent.vue';

const blockedUsersList = ref<User[]>((await axios.get(`${API_URL}/user/block`)).data);

const unblockUser = (username: string) => {
  const filteredUsers = blockedUsersList.value.filter(
    (user) => user.username === username
  );
  blockedUsersList.value = filteredUsers;
  axios
    .delete(`${API_URL}/user/block/${username}`)
    .then((res) => {
      console.log(res);
    })
    .catch((e) => console.log(e));
};
</script>

<template>
  <h2>Blocked users:</h2>
  <ul class="blocked-users-list">
    <li v-for="user in blockedUsersList" v-bind:key="user.id" class="flex">
      <UserCardComponent :user="user"></UserCardComponent
      ><button class="button-small" @click="() => unblockUser(user.username)">
        unfollow
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
