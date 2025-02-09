<script setup lang="ts">
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import UserPostListComponent from '../components/UserPostListComponent.vue';
import { getUserPosts } from '../api/get-user-posts';
import type { Post } from '@/modules/user/models/post-model';
import FollowedUsersListComponent from '../components/FollowedUsersListComponent.vue';
import MutedUsersListComponent from '../components/MutedUsersListComponent.vue';
import BlockedUsersListComponent from '../components/BlockedUsersListComponent.vue';
import { API_URL } from '@/config/env';
import router from '@/router';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import axios from 'axios';

const ownName = localStorage.getItem('name');
const ownUsername = localStorage.getItem('username');

const route = useRoute();
const username = route.params.username;

const user = ref({ username: '', name: '' });

const routeBack = () => {
  router.back();
};

onMounted(() => {
  axios
    .get(`${API_URL}/user/profile/${username}`)
    .then((res) => {
      user.value.name = res.data.name;
      user.value.username = res.data.username;
    })
    .catch(console.log);
});
</script>

<template>
  <InfiniteScrollPageComponent
    :fetchData="getUserPosts"
    :postsPerPage="10"
    :no-items-message="'No posts yet...'"
    :base-fetch-url="`${API_URL}/user/post/user/${username}`"
  >
    <template #regular-content>
      <div class="profile-data">
        <header class="header">
          <button class="button-small button-primary" @click="routeBack">
            <i class="pi pi-chevron-left"></i>
          </button>
          <h3>
            <span>{{ user.name }}</span
            ><span class="font-grey"> @{{ user.username }}</span>
          </h3>
        </header>
        <!-- <Suspense>
        <FollowedUsersListComponent></FollowedUsersListComponent>
        <template #fallback><p>Loading...</p></template>
      </Suspense>
      <Suspense>
        <MutedUsersListComponent></MutedUsersListComponent>
        <template #fallback><p>Loading...</p></template>
      </Suspense>
      <Suspense>
        <BlockedUsersListComponent></BlockedUsersListComponent>
        <template #fallback><p>Loading...</p></template>
      </Suspense> -->
      </div>
    </template>

    <template #itemList="{ itemList }">
      <UserPostListComponent :post-list="(itemList as Post[])" />
    </template>
  </InfiniteScrollPageComponent>
</template>
<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.profile-data {
  box-sizing: border-box;
  width: 100%;
  max-width: 38rem;
}

.header {
  box-sizing: border-box;
  padding: 0.5rem 0.25rem 1.5rem;
  width: 100%;
  max-width: 38rem;
  display: flex;
  align-items: center;
  position: relative;
  border-right: 0.0625rem solid $border-grey;

  h3 {
    margin: auto;
  }

  button {
    position: absolute;
  }
}
</style>
