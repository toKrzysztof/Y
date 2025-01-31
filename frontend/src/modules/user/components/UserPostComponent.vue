<script setup lang="ts">
import type { Post } from '@/modules/user/models/post-model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ = defineProps<{ post: Post }>();
</script>
<template>
  <article>
    <div class="user-post-data">
      <header class="user-post-header">
        <span class="user-post-username">{{ post.username }}</span>
        <span>-</span><span>{{ $formattedDate(post.createdAt) }}</span>
      </header>
      <p class="user-post-content">{{ post.content }}</p>
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
  </article>
</template>
<style lang="scss" scoped>
.user-post-created-at {
  padding-top: 2rem;
  font-size: 0.875rem;
}

.user-post-content {
  padding: 0;
}

.user-post-header {
  align-items: center;
  display: flex;
  gap: 0.5rem;

  .user-post-username {
    font-weight: 700;
  }

  h3 {
    margin: 0;
  }
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
