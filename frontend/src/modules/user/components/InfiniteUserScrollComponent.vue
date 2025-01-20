<script setup lang="ts">
import { getUsers } from '@/modules/user/api/api/get-users';
import { ref } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import type { User } from '@/models/user-model';
import UserCardComponent from './UserCardComponent.vue';

const listElement = ref(null);
const usersToShow = 10;
const userList = ref<User[]>(await getUsers(usersToShow, 0));
const fetchingData = ref<boolean>(false);

const getUsersOnScroll = async () => {
  try {
    fetchingData.value = true;
    // await new Promise((res) => setTimeout(res, 500));

    const newUsers = await getUsers(usersToShow, userList.value.length);
    userList.value.push(...newUsers);
  } catch (err) {
    console.log(err);
  } finally {
    fetchingData.value = false;
  }
};

useInfiniteScroll(
  listElement,
  async () => {
    await getUsersOnScroll();
  },
  { distance: 50 }
);
</script>
<template>
  InfiniteUserScrollComponent works!
  <ol ref="listElement" class="user-list">
    <li v-for="user in userList" v-bind:key="user.id" class="post">
      <UserCardComponent :user="user"></UserCardComponent>
    </li>
    <p v-show="fetchingData" class="loader">Loading...</p>
  </ol>
</template>
<style lang="scss" scoped>
.user-list {
  align-items: center;
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  max-height: calc(100vh - 4rem);
  overflow-y: scroll;
  padding: 4rem 0 0 0;
  width: 100%;
}

.user-list > :nth-last-child(2) {
  margin-bottom: 10rem;
}

.user-list > :last-child() {
  margin-bottom: 10rem;
}

.post {
  padding: 12px 0;
  font-size: 18px;
  margin-right: 20rem;
}

.loader {
  position: absolute;
  bottom: 1rem;
}
</style>
