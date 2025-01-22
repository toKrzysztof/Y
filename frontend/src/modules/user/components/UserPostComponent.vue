<script setup lang="ts">
import type { Post } from '@/modules/user/models/post-model';
import UserCommentListComponent from './UserCommentListComponent.vue';
import FollowUserTile from './FollowUserTile.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ = defineProps<{ post: Post }>();
</script>
<template>
  <article class="user-post">
    <div class="user-post-data">
      <header class="user-post-header">
        <h3>{{ post.title }}</h3>
        <FollowUserTile :username="post.username"></FollowUserTile>
      </header>
      <p class="user-post-content">{{ post.content }}</p>
      <div class="user-post-created-at">{{ $formattedDate(post.createdAt) }}</div>
    </div>
    <UserCommentListComponent :comment-list="post.comments"></UserCommentListComponent>
  </article>
</template>
<style lang="scss" scoped>
.user-post {
  border-bottom: 0.125rem solid black;
  border-top: 0.125rem solid black;
  min-width: 20rem;
  padding: 1rem;
}

.user-post-data {
  padding-bottom: 0.5rem;
  border-bottom: 0.0625rem solid black;
}

.user-post-created-at {
  padding-top: 2rem;
  font-size: 0.875rem;
}

.user-post-content {
  padding: 0 1rem;
}

.user-post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-post {
}
</style>
