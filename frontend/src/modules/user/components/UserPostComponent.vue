<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '@/modules/user/models/post-model';

const props = defineProps<{ post: Post }>();

const urlRegex =
  /(?<!\S)(https?:\/\/)?(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63}(?<!-))*(?!\S)/g;

const contentParts = computed(() => {
  const parts = [];
  let lastIndex = 0;

  const matches = Array.from(props.post.content.matchAll(urlRegex));

  for (const match of matches) {
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;

    const isFullMatch =
      (matchStart === 0 || !/\S/.test(props.post.content[matchStart - 1])) &&
      (matchEnd === props.post.content.length ||
        !/\S/.test(props.post.content[matchEnd]));

    if (isFullMatch) {
      if (matchStart > lastIndex) {
        parts.push({
          type: 'text',
          value: props.post.content.slice(lastIndex, matchStart)
        });
      }

      let url = match[0];
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }

      parts.push({ type: 'link', value: url });

      lastIndex = matchEnd;
    }
  }

  if (lastIndex < props.post.content.length) {
    parts.push({
      type: 'text',
      value: props.post.content.slice(lastIndex)
    });
  }

  return parts;
});
</script>

<template>
  <article>
    <div class="user-post-data">
      <header class="user-post-header">
        <div class="user-post-primary-data font-grey">
          <span class="user-post-name">{{ post.authorName }}</span>
          <span class="user-post-username font-grey">@{{ post.authorUsername }}</span>
          <span>-</span>
          <span>{{ $formattedDate(post.createdAt) }}</span>
        </div>
        <div
          v-if="post.parentPostId !== null && post.parentPostId !== undefined"
          class="user-post-reply-info font-grey"
        >
          Replying to @{{ post.parentPostAuthorUsername }}
        </div>
      </header>
      <p class="user-post-content">
        <template v-for="(part, index) in contentParts" :key="index">
          <template v-if="part.type === 'text'">
            {{ part.value }}
          </template>
          <a v-else :href="part.value" target="_blank" rel="noopener noreferrer">
            {{ part.value }}
          </a>
        </template>
      </p>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.user-post-primary-data {
  align-items: center;
  display: flex;
  gap: 0.5rem;
}

.user-post-created-at {
  padding-top: 2rem;
  font-size: 0.875rem;
}

.user-post-content {
  padding: 0;
  margin: 0;
  padding-top: 0.3125rem;

  a {
    color: #1da1f2;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.user-post-reply-info {
  padding-top: 0.3125rem;
}

.user-post-header {
  .user-post-name {
    color: white;
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
