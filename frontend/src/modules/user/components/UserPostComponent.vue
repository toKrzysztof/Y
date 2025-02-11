<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Post } from '@/modules/user/models/post-model';
import router from '@/router';
import UserActionsTile from './UserActionsTile.vue';
import { isUserBlocked, isUserMuted } from '../utils/localStorageUtils';

const props = defineProps<{ post: Post; threadView: boolean }>();

const contentParts = computed(() => {
  const parts = [];
  let lastIndex = 0;

  const words = props.post.content.split(/\s+/);

  for (const word of words) {
    try {
      const url = new URL(word);

      if (lastIndex < props.post.content.indexOf(word, lastIndex)) {
        parts.push({
          type: 'text',
          value: props.post.content.slice(
            lastIndex,
            props.post.content.indexOf(word, lastIndex)
          )
        });
      }

      parts.push({ type: 'link', value: url.toString() });

      lastIndex = props.post.content.indexOf(word, lastIndex) + word.length;
    } catch {
      if (lastIndex < props.post.content.indexOf(word, lastIndex)) {
        parts.push({
          type: 'text',
          value: props.post.content.slice(
            lastIndex,
            props.post.content.indexOf(word, lastIndex)
          )
        });
      }

      parts.push({ type: 'text', value: word });

      lastIndex = props.post.content.indexOf(word, lastIndex) + word.length;
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

const userBlocked = ref(isUserBlocked(props.post.authorUsername));
const userMuted = ref(isUserMuted(props.post.authorUsername));
const displayPost = ref(userBlocked.value === false && userMuted.value === false);

const encodeBase64 = (str: string) => {
  return btoa(str);
};

const onClick = () => {
  router.push(`/user/post/${btoa(props.post.id)}`);
};

const switchPostDisplay = () => {
  displayPost.value = !displayPost.value;
};
</script>

<template>
  <article>
    <div
      v-if="(userBlocked === false && userMuted === false) || displayPost === true"
      class="user-post-data"
    >
      <header class="user-post-header">
        <div class="space-between">
          <div class="user-post-primary-data font-grey">
            <span class="user-post-name">{{ post.authorName }}</span>
            <div class="user-actions-popover-wrapper">
              <RouterLink
                class="user-post-username font-grey"
                :to="`/user/${props.post.authorUsername}`"
                >@{{ post.authorUsername }}</RouterLink
              >
              <div class="user-actions-wrapper">
                <UserActionsTile
                  :name="post.authorName"
                  :username="post.authorUsername"
                ></UserActionsTile>
              </div>
            </div>
            <span>-</span>
            <span class="post-created-at-time">{{
              $formattedDate(post.createdAt)
            }}</span>
          </div>
          <div v-show="threadView === false">
            <button class="button-small button-primary" @click="onClick">
              <i class="icon-chevron-right"></i>
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
      <div class="user-post-images" v-if="post.links?.length > 0">
        <ul class="user-post-image-list">
          <li v-for="image of post.links" :key="image" class="user-post-image">
            <img :src="image" alt="image" />
          </li>
        </ul>
      </div>
      <div class="post-footer">
        <div class="post-data-icons font-grey">
          <div class="post-data-icon-section">
            <i class="icon-comment"></i>
            <span>{{ post.replies?.length || 0 }}</span>
          </div>
        </div>
        <div>
          <button
            class="button-primary button-extra-small"
            @click="switchPostDisplay"
            v-if="displayPost === true && (userBlocked || userMuted)"
          >
            Hide post
          </button>
        </div>
      </div>
    </div>
    <div
      class="post-hidden"
      v-if="displayPost === false && (userBlocked === true || userMuted === true)"
    >
      <div class="font-grey" v-if="userBlocked === true">
        This post was made by a person you blocked
      </div>
      <div class="font-grey" v-if="userMuted === true && userBlocked === false">
        This post was made by a person you muted
      </div>
      <button
        class="button-primary button-extra-small"
        v-show="displayPost === false"
        @click="switchPostDisplay"
      >
        Show post
      </button>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.user-post-primary-data {
  align-items: center;
  display: flex;
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
  font-size: 0.875rem;

  .post-data-icon-section {
    span {
      font-size: 0.75rem;
      padding-left: 0.25rem;
    }
  }
}

.user-post-reply-info {
  width: fit-content;
  color: #1da1f2;
}

.user-actions-wrapper {
  position: relative;
  padding-left: 0.5rem;
}

.user-actions-popover-wrapper {
  display: flex;
  padding-left: 0.5rem;
}

.user-actions-popover-wrapper:hover:deep(.user-actions-tile) {
  opacity: 1;
  z-index: 100;
  transition: 200ms ease-in;
}

.post-created-at-time {
  padding-left: 0.5rem;
}

.post-hidden {
  align-self: center;
  display: flex;
  justify-content: space-between;
}

.post-footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
}

.user-post-image-list {
  list-style: none;
  padding: 0;
}

.user-post-image {
  img {
    max-height: 36rem;
    max-width: 36rem;
    width: 100%;
    object-fit: contain;
  }
}

.user-post-images {
  padding-top: 1rem;
}
</style>
