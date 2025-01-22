<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '@/modules/user/models/user-model';
import { API_URL } from '@/config/env';
import axios from 'axios';
import UserCardComponent from './UserCardComponent.vue';

const followedUsersList = ref<User[]>((await axios.get(`${API_URL}/user/follow`)).data);

const unfollowUser = (username: string) => {
  const filteredUsers = followedUsersList.value.filter(
    (user) => user.username !== username
  );
  followedUsersList.value = filteredUsers;
  axios
    .delete(`${API_URL}/user/follow/${username}`)
    .then((res) => {
      console.log(res);
    })
    .catch((e) => console.log(e));
};
</script>

<template>
  <h2>Followed users:</h2>
  <ul class="followed-users-list">
    <li v-for="user in followedUsersList" v-bind:key="user.id" class="flex">
      <UserCardComponent :user="user"></UserCardComponent
      ><button class="button-small" @click="() => unfollowUser(user.username)">
        Unfollow
      </button>
    </li>
  </ul>
</template>
<style lang="scss" scoped>
.followed-users-list {
  @extend %reset-ordered-list;
}

.flex {
  align-items: center;
  display: flex;
  gap: 0.5rem;
}
</style>
