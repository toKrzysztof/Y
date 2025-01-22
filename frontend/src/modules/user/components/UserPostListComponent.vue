<script setup lang="ts">
import type { Post } from '@/modules/user/models/post-model';
import UserPostComponent from './UserPostComponent.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ = defineProps<{ postList: Post[] }>();
</script>
<template>
  <ol ref="listElement" class="post-list">
    <li v-for="post in postList" v-bind:key="post.postId">
      <UserPostComponent :post="post"></UserPostComponent>
    </li>
  </ol>
</template>
<style lang="scss" scoped>
.post-list {
  @extend %reset-ordered-list;
  gap: 3rem;
  padding-top: 1rem;
}
</style>
