<script setup lang="ts">
import type { Post } from '@/modules/user/models/post-model';
import UserCommentListComponent from './UserCommentListComponent.vue';
import UserActionsTile from './UserActionsTile.vue';
import { isUserBlocked } from '../utils/userRelationshipsStorageUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ = defineProps<{ post: Post }>();
</script>
<template>
  <article class="user-post">
    <div class="user-post-data">
      <header class="user-post-header">
        <h3>{{ post.title }}</h3>
        <UserActionsTile :username="post.username"></UserActionsTile>
      </header>
      <p class="user-post-content">{{ post.content }}</p>
      <div class="user-post-created-at">{{ $formattedDate(post.createdAt) }}</div>
      <div>
        <ol class="post-links-list">
          <h4>Links:</h4>
          <span v-show="post.links.length === 0" class="no-links-message"
            >No links attached...</span
          >
          <div v-if="post.links.length > 0">
            <li v-for="(link, index) in post.links" v-bind:key="index">
              <a :href="link" class="link-normal">{{ link }}</a>
            </li>
          </div>
        </ol>
      </div>
    </div>
    <UserCommentListComponent
      :comment-list="
        post.comments.filter((comment) => !isUserBlocked(comment.username))
      "
      :parent-id="post.postId"
    ></UserCommentListComponent>
  </article>
</template>
<style lang="scss" scoped>
.user-post {
  border-bottom: 0.125rem solid black;
  border-top: 0.125rem solid black;
  width: 30rem;
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

.post-links-list {
  @extend %reset-ordered-list;
  align-items: flex-start;

  .no-links-message {
    font-size: 0.875rem;
  }
}

h4 {
  margin-bottom: 0.5rem;
}
</style>
