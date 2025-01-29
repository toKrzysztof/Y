<script setup lang="ts">
import UserCommentComponent from './UserCommentComponent.vue';
import type { Comment } from '../models/comment-model';
import UserCommentFormComponent from './UserCommentFormComponent.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ commentList: Comment[] }>();
</script>
<template>
  <h4 class="x-center">Comments</h4>
  <ol ref="listElement" class="comment-list">
    <li v-for="comment in commentList" v-bind:key="comment.id" class="full-width">
      <UserCommentComponent :comment="comment"></UserCommentComponent>
    </li>
    <p v-show="commentList.length === 0">No comments yet...</p>
    <UserCommentFormComponent
      :comment-props="{ ...comment }"
    ></UserCommentFormComponent>
  </ol>
</template>
<style lang="scss" scoped>
.comment-list {
  @extend %reset-ordered-list;
  align-items: flex-start;
  padding-left: 1rem;
  gap: 1rem;
  min-width: 20rem;
}

.x-center {
  display: flex;
  justify-content: center;
}

.full-width {
  width: 100%;
}
</style>
