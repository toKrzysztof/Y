<script setup lang="ts">
import { getRandomPosts } from '../api/get-random-posts';
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import UserPostListComponent from '../components/UserPostListComponent.vue';
import { API_URL } from '@/config/env';
import type { Post } from '../models/post-model';
</script>

<template>
  <InfiniteScrollPageComponent
    :fetchData="getRandomPosts"
    :postsPerPage="10"
    :no-items-message="'No posts yet...'"
    :base-fetch-url="`${API_URL}/user/post`"
  >
    <template #itemList="{ itemList }">
      <UserPostListComponent :post-list="(itemList as Post[])" />
    </template>
  </InfiniteScrollPageComponent>
</template>
