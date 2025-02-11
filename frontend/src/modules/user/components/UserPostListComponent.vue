<script setup lang="ts">
import type { Post } from '@/modules/user/models/post-model';
import UserPostComponent from './UserPostComponent.vue';
import type { InfiniteScrollContent } from '../models/infinite-scroll-content.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ postList: (Post & InfiniteScrollContent)[] }>();
</script>
<template>
  <ol ref="listElement" class="post-list">
    <li v-for="post in postList" :key="`${post.postId}-${post.key}`" class="user-post">
      <UserPostComponent :post="post" :threadView="false"></UserPostComponent>
    </li>
  </ol>
</template>
<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.user-post {
  border-top: 0.0625rem solid $border-grey;
  border-bottom: 0;
  box-sizing: border-box;
  font-size: 0.9375rem;
  padding: 1rem;
  width: 100%;

  &:first-child {
    border-top: 0.0625rem solid $border-grey;
  }

  &:last-child {
    border-bottom: 0.0625rem solid $border-grey;
  }
}
.post-list {
  @extend %reset-ordered-list;
  gap: 0;
  max-width: 38rem;
  width: 100%;
}
</style>
