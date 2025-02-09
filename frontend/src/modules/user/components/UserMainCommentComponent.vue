<script setup lang="ts">
import type { Comment } from '../models/comment-model';

const props = defineProps<{ comment: Comment }>();
</script>
<template>
  <article class="user-comment">
    <div class="user-comment-content">
      <span class="user-comment-author-username">{{ props.comment.username }}</span>
      <span>{{ props.comment.content }}</span>
    </div>
    <div class="user-comment-footer">
      <div class="user-comment-created-at">
        {{ $formattedDate(props.comment.createdAt) }}
      </div>
    </div>
  </article>
</template>
<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.user-comment-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.5rem;
}
.user-comment {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  min-width: 20rem;
  padding: 1rem;
  border-bottom: 0.0625rem solid $border-grey;
  margin-top: 2rem;
}

.user-comment-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-comment-author-username {
  font-weight: 700;
}

.user-comment-created-at {
  font-size: 0.875rem;
}
</style>
