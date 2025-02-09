<script setup lang="ts">
import { getPosts } from '../api/get-posts';
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import UserPostListComponent from '../components/UserPostListComponent.vue';
import { API_URL } from '@/config/env';
import type { Post } from '../models/post-model';
import UserPostFormComponent from '../components/UserPostFormComponent.vue';
const submitButtonLabels = { regularLabel: 'Post', loadingLabel: 'Posting...' };
</script>
<template>
  <InfiniteScrollPageComponent
    :fetchData="getPosts"
    :postsPerPage="10"
    :no-items-message="'No posts yet...'"
    :base-fetch-url="`${API_URL}/user/post`"
  >
    <template #regular-content>
      <UserPostFormComponent
        :submit-button-labels="submitButtonLabels"
        :content-placeholder="'What is happening?!'"
      ></UserPostFormComponent>
    </template>
    <template #itemList="{ itemList }">
      <UserPostListComponent :post-list="(itemList as Post[])" />
    </template>
  </InfiniteScrollPageComponent>
</template>
