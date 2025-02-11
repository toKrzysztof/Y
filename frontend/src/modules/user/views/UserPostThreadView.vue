<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { API_URL } from '@/config/env';
import { getPostThreadReplies } from '../api/get-post-thread-replies';
import UserPostComponent from '../components/UserPostComponent.vue';
import router from '@/router';
import type { Post } from '../models/post-model';
import UserReplyListComponent from '../components/UserReplyListComponent.vue';

const post = ref({
  id: '',
  parentPostId: null,
  replies: [],
  authorUsername: '',
  parentPostAuthorUsername: null,
  authorName: '',
  content: '',
  createdAt: '',
  links: [],
  postId: ''
});
const route = useRoute();
const postId = route.params.postId;

onMounted(() => {
  axios
    .get(`${API_URL}/user/post/reply/${postId}`)
    .then((res) => {
      post.value = res.data;
    })
    .catch(console.log);
});

const routeBack = () => {
  router.back();
};
</script>
<template>
  <InfiniteScrollPageComponent
    :fetch-data="getPostThreadReplies"
    :posts-per-page="10"
    :base-fetch-url="`${API_URL}/user/post/reply/${postId}/reply`"
  >
    <template #regular-content>
      <header class="header">
        <button class="button-small button-primary" @click="routeBack">
          <i class="pi pi-chevron-left"></i>
        </button>
        <h3 v-show="post.parentPostId === null || post.parentPostId === undefined">
          Post
        </h3>
        <h3 v-show="post.parentPostId !== null && post.parentPostId !== undefined">
          Reply
        </h3>
      </header>
      <div class="user-post" v-if="post.id !== ''">
        <UserPostComponent :post="post" :thread-view="true"></UserPostComponent>
      </div>
    </template>
    <template #itemList="{ itemList }">
      <UserReplyListComponent
        :post-list="(itemList as Post[])"
      ></UserReplyListComponent>
    </template>
  </InfiniteScrollPageComponent>
</template>
<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.user-post {
  border-right: 0.0625rem solid $border-grey;
  border-bottom: 0.0625rem solid $border-grey;
  box-sizing: border-box;
  font-size: 0.9375rem;
  padding: 0 1rem 1rem 1rem;
  max-width: 38rem;
  width: 100%;
}

.header {
  box-sizing: border-box;
  padding: 0.5rem 0.25rem 1.5rem;
  width: 100%;
  max-width: 38rem;
  display: flex;
  align-items: center;
  position: relative;
  border-right: 0.0625rem solid $border-grey;

  h3 {
    margin: auto;
  }

  button {
    position: absolute;
  }
}

:deep(.post-form-panel) {
  border-right: 0;
}

.scroll-page-content-wrapper:deep(.user-post) {
  border-top: 0;
}
</style>
