<script setup lang="ts">
import router from '@/router';
import type { Comment } from '../models/comment-model';
import UserActionsTile from './UserActionsTile.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ comment: Comment }>();

const onClick = (commentId: string) => {
  router.push(`/user/comment/${btoa(commentId)}`);
};
</script>
<template>
  <article class="user-comment">
    <div class="user-comment-content">
      <UserActionsTile :username="comment.username"></UserActionsTile>
      <span>{{ comment.content }}</span>
    </div>
    <div class="user-comment-footer">
      <div class="user-comment-created-at">{{ $formattedDate(comment.createdAt) }}</div>
      <div class="button-box">
        <button
          class="button-small button-primary"
          v-on:click="() => onClick(comment.id)"
        >
          View thread
        </button>
      </div>
    </div>
  </article>
</template>
<style lang="scss" scoped>
.usec-comment-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.5rem;
}
.user-comment {
  border-radius: 0.25rem;
  padding-left: 0.5rem 0 0.5rem 0.5rem;
  width: 100%;
}

.user-comment-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
}

.user-comment-author-username {
  font-weight: 700;
}

.user-comment-created-at {
  font-size: 0.875rem;
}

.button-box {
  display: flex;
  justify-content: flex-end;
}
</style>
