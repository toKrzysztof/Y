<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '@/modules/user/models/user-model';
import { API_URL } from '@/config/env';
import axios from 'axios';
import UserCardComponent from './UserCardComponent.vue';

const mutedUsersList = ref<User[]>((await axios.get(`${API_URL}/user/mute`)).data);

const unmuteUser = (username: string) => {
  const filteredUsers = mutedUsersList.value.filter(
    (user) => user.username !== username
  );
  mutedUsersList.value = filteredUsers;
  axios
    .delete(`${API_URL}/user/mute/${username}`)
    .then(() => {})
    .catch((e) => console.log(e));
};
</script>

<template>
  <h2>Muted users:</h2>
  <div v-show="mutedUsersList.length === 0">No users blocked.</div>
  <ul class="blocked-users-list" v-if="mutedUsersList.length > 0">
    <li v-for="user in mutedUsersList" v-bind:key="user.id" class="flex">
      <UserCardComponent :user="user"></UserCardComponent
      ><button
        class="button-small button-primary"
        @click="() => unmuteUser(user.username)"
      >
        Unmute
      </button>
    </li>
  </ul>
</template>
<style lang="scss" scoped>
.muted-users-list {
  @extend %reset-ordered-list;
}

.flex {
  align-items: center;
  display: flex;
  gap: 0.5rem;
}
</style>
