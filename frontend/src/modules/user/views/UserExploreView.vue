<script setup lang="ts">
import { getRandomPosts } from '../api/get-random-posts';
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import UserPostListComponent from '../components/UserPostListComponent.vue';
import { API_URL } from '@/config/env';
import type { Post } from '../models/post-model';
import { isUserBlocked } from '../utils/userRelationshipsStorageUtils';
import UserPostFormComponent from '../components/UserPostFormComponent.vue';
</script>

<template>
  <InfiniteScrollPageComponent
    :fetchData="getRandomPosts"
    :postsPerPage="10"
    :no-items-message="'No posts yet...'"
    :base-fetch-url="`${API_URL}/user/post`"
  >
    <template #regular-content>
      <UserPostFormComponent></UserPostFormComponent>
    </template>
    <template #itemList="{ itemList }">
      <UserPostListComponent
        :post-list="(itemList as Post[]).filter(post => !isUserBlocked(post.username))"
      />
    </template>
  </InfiniteScrollPageComponent>
</template>
