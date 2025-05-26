<script setup lang="ts">
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import UserPostListComponent from '../components/UserPostListComponent.vue';
import { getPostsFromFollowedUsers } from '../api/get-posts-from-followed-users';
import type { Post } from '../models/post-model';
import { API_URL } from '@/config/env';
import UserPostFormComponent from '../components/UserPostFormComponent.vue';
import type { InfiniteScrollContent } from '../models/infinite-scroll-content.model';
import { isUserBlocked, isUserFollowed } from '../utils/localStorageUtils';
const submitButtonLabels = { regularLabel: 'Post', loadingLabel: 'Posting...' };
</script>

<template>
  <InfiniteScrollPageComponent
    :fetchData="getPostsFromFollowedUsers"
    :postsPerPage="15"
    :no-items-message="'No posts yet...'"
    :base-fetch-url="`${API_URL}/user/post/follow`"
    :filter-predicate="((post) => isUserFollowed((post as Post).authorUsername))"
  >
    <template #regular-content>
      <UserPostFormComponent
        :submit-button-labels="submitButtonLabels"
        :content-placeholder="'What is happening?!'"
      ></UserPostFormComponent>
    </template>
    <template #itemList="{ itemList }">
      <UserPostListComponent
        :post-list="(itemList as (Post & InfiniteScrollContent)[])"
      />
    </template>
  </InfiniteScrollPageComponent>
</template>
