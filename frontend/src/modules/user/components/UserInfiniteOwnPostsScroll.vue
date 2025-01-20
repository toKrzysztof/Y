<script setup lang="ts">
import { getOwnPosts } from '@/modules/user/api/api/get-own-posts';
import { ref } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import type { Post } from '@/models/post-model';
import UserPostComponent from './UserPostComponent.vue';

const listElement = ref(null);
const ownPostsToShow = 10;
const ownPostList = ref<Post[]>(await getOwnPosts(ownPostsToShow, 0));
const fetchingData = ref<boolean>(false);

const getOwnPostsOnScroll = async () => {
  try {
    fetchingData.value = true;
    // await new Promise((res) => setTimeout(res, 2000));

    const newPosts = await getOwnPosts(ownPostsToShow, ownPostList.value.length);
    ownPostList.value.push(...newPosts);
  } catch (err) {
    console.log(err);
  } finally {
    fetchingData.value = false;
  }
};

useInfiniteScroll(
  listElement,
  async () => {
    await getOwnPostsOnScroll();
  },
  { distance: 50 }
);
</script>
<template>
  InfiniteUserScrollComponent works!
  <ol ref="listElement" class="post-list">
    <li v-for="post in ownPostList" v-bind:key="post.postId" class="post">
      <UserPostComponent :post="post"></UserPostComponent>
    </li>
    <p v-show="fetchingData" class="loader">Fetching...</p>
  </ol>
</template>
<style lang="scss" scoped>
.post-list {
  align-items: center;
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  max-height: calc(100vh - 4rem);
  overflow-y: scroll;
  padding: 4rem 0 0 0;
  width: 100%;
}

.post-list > :nth-last-child(2) {
  margin-bottom: 10rem;
}

.post {
  padding: 12px 0;
  font-size: 18px;
}

// .loader {
//   position: absolute;
//   bottom: 1rem;
// }
</style>
