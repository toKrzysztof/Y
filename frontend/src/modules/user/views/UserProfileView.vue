<script setup lang="ts">
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import UserPostListComponent from '../components/UserPostListComponent.vue';
import { getOwnPosts } from '../api/get-own-posts';
import type { Post } from '@/modules/user/models/post-model';
import FollowedUsersListComponent from '../components/FollowedUsersListComponent.vue';
import MutedUsersListComponent from '../components/MutedUsersListComponent.vue';
import BlockedUsersListComponent from '../components/BlockedUsersListComponent.vue';
import { API_URL } from '@/config/env';
</script>

<template>
  <InfiniteScrollPageComponent
    :fetchData="getOwnPosts"
    :postsPerPage="10"
    :no-items-message="'No posts yet...'"
    :base-fetch-url="`${API_URL}/user/post/own-post`"
  >
    <template #regular-content>
      <h1>My profile</h1>

      <Suspense>
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
      </Suspense>
    </template>

    <template #itemList="{ itemList }">
      <UserPostListComponent :post-list="(itemList as Post[])" />
    </template>
  </InfiniteScrollPageComponent>
</template>
