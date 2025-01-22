<template>
  <InfiniteScrollPageComponent :fetchData="getOwnPosts" :postsPerPage="10">
    <template #header>
      <h1>TEST HEADER</h1>
    </template>

    <template #itemList="{ itemList }">
      <UserPostListComponent :post-list="(itemList as Post[])" />
    </template>
  </InfiniteScrollPageComponent>
</template>

<script setup lang="ts">
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import UserPostListComponent from '../components/UserPostListComponent.vue';
import { getOwnPosts } from '../api/get-own-posts';
import type { Post } from '@/modules/user/models/post-model';
</script>
