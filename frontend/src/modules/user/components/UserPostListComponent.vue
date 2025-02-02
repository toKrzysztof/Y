<script setup lang="ts">
import type { Post } from '@/modules/user/models/post-model';
import UserPostComponent from './UserPostComponent.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ = defineProps<{ postList: Post[] }>();
</script>
<template>
  <ol ref="listElement" class="post-list">
    <li v-for="post in postList" v-bind:key="post.postId" class="user-post">
      <UserPostComponent :post="post"></UserPostComponent>
    </li>
  </ol>
</template>
<style lang="scss" scoped>
.user-post {
  border: 0.0625rem solid black;
  border-bottom: 0;
  box-sizing: border-box;
  font-size: 0.9375rem;
  padding: 1rem;
  width: 100%;

  &:first-child {
    border-top: 0;
  }

  &:last-child {
    border-bottom: 0.0625rem solid black;
  }
}
.post-list {
  @extend %reset-ordered-list;
  gap: 0;
  max-width: 38rem;
  width: 100%;
}
</style>
