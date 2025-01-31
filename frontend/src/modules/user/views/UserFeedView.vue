<script setup lang="ts">
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import UserPostListComponent from '../components/UserPostListComponent.vue';
import { getPostsFromFollowedUsers } from '../api/get-posts-from-followed-users';
import type { Post } from '../models/post-model';
import { API_URL } from '@/config/env';
import UserPostFormComponent from '../components/UserPostFormComponent.vue';
</script>

<template>
  <InfiniteScrollPageComponent
    :fetchData="getPostsFromFollowedUsers"
    :postsPerPage="10"
    :no-items-message="'No posts yet...'"
    :base-fetch-url="`${API_URL}/user/post/follow`"
  >
    <template #regular-content>
      <UserPostFormComponent></UserPostFormComponent>
    </template>
    <template #itemList="{ itemList }">
      <UserPostListComponent :post-list="(itemList as Post[])" />
    </template>
  </InfiniteScrollPageComponent>
</template>
