<script setup lang="ts">
import UserPostComponent from './UserPostComponent.vue';
import type { Post } from '../models/post-model';
import UserPostFormComponent from './UserPostFormComponent.vue';
import { useRoute } from 'vue-router';
import type { InfiniteScrollContent } from '../models/infinite-scroll-content.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  postList: (Post & InfiniteScrollContent)[];
}>();

const route = useRoute();

const parentId = route.params.postId as string;

const submitButtonLabels = { regularLabel: 'Reply', loadingLabel: 'Replying...' };
</script>
<template>
  <UserPostFormComponent
    :submit-button-labels="submitButtonLabels"
    :content-placeholder="'Post your reply'"
    :parent-id="parentId"
  ></UserPostFormComponent>
  <ol ref="listElement" class="reply-list">
    <li
      v-for="post in postList"
      v-bind:key="`${post.id}-${post.key}`"
      class="user-reply"
    >
      <UserPostComponent :post="post" :thread-view="false"></UserPostComponent>
    </li>
    <p v-if="postList.length === 0" class="paragraph-center">No replies yet...</p>
  </ol>
</template>
<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.user-reply {
  border-top: 0.0625rem solid $border-grey;
  box-sizing: border-box;
  font-size: 0.9375rem;
  padding: 1rem;
  width: 100%;

  &:last-child {
    border-bottom: 0.0625rem solid $border-grey;
  }
}

.reply-list {
  @extend %reset-ordered-list;
  gap: 0;
  max-width: 38rem;
  width: 100%;
}

.paragraph-center {
  width: 100%;
  margin-top: 0rem;
  padding-top: 1rem;
  text-align: center;
  border-top: 0.0625rem solid $border-grey;
}
</style>
