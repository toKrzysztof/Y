<script setup lang="ts">
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import UserPostListComponent from '../components/UserPostListComponent.vue';
import { getUserPosts } from '../api/get-user-posts';
import type { Post } from '@/modules/user/models/post-model';
import { API_URL } from '@/config/env';
import { useRoute } from 'vue-router';
import UserMainProfileDataComponent from '../components/UserMainProfileDataComponent.vue';
import type { InfiniteScrollContent } from '../models/infinite-scroll-content.model';

const route = useRoute();
const username = route.params.username;
</script>

<template>
  <InfiniteScrollPageComponent
    :fetchData="getUserPosts"
    :postsPerPage="10"
    :no-items-message="'No posts yet...'"
    :base-fetch-url="`${API_URL}/user/post/user/${username}`"
  >
    <template #regular-content>
      <UserMainProfileDataComponent></UserMainProfileDataComponent>
    </template>

    <template #itemList="{ itemList }">
      <UserPostListComponent
        :post-list="(itemList as (Post & InfiniteScrollContent)[])"
      />
    </template>
  </InfiniteScrollPageComponent>
</template>
