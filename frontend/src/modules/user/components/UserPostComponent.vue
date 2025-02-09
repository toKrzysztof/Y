<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '@/modules/user/models/post-model';
import router from '@/router';

const props = defineProps<{ post: Post; threadView: boolean }>();

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

const encodeBase64 = (str: string) => {
  return btoa(str);
};

const onClick = () => {
  router.push(`/user/post/${btoa(props.post.id)}`);
};
</script>

<template>
  <article>
    <div class="user-post-data">
      <header class="user-post-header">
        <div class="space-between">
          <div class="user-post-primary-data font-grey">
            <span class="user-post-name">{{ post.authorName }}</span>
            <RouterLink
              class="user-post-username font-grey"
              :to="`/user/${props.post.authorUsername}`"
              >@{{ post.authorUsername }}</RouterLink
            >
            <span>-</span>
            <span>{{ $formattedDate(post.createdAt) }}</span>
          </div>
          <div v-show="threadView === false">
            <button class="button-small button-primary" @click="onClick">
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        </div>
        <RouterLink
          class="user-post-reply-info"
          v-if="post.parentPostId !== null && post.parentPostId !== undefined"
          :to="'/user/post/' + encodeBase64(post.parentPostId)"
        >
          Replying to @{{ post.parentPostAuthorUsername }}
        </RouterLink>
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
      <div class="post-data-icons font-grey">
        <div class="post-data-icon-section">
          <i class="pi pi-comment"></i>
          <span>{{ post.replies?.length || 0 }}</span>
        </div>
      </div>
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
    display: inline;

    &:hover {
      text-decoration: underline;
    }
  }
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

.space-between {
  display: flex;
  justify-content: space-between;
  min-height: 1.625rem;
}

.post-data-icons {
  display: flex;
  padding-top: 1rem;
  font-size: 0.875rem;

  .post-data-icon-section {
    span {
      font-size: 0.75rem;
      padding-left: 0.25rem;
    }
  }
}

.user-post-reply-info {
  color: #1da1f2;
}
</style>
