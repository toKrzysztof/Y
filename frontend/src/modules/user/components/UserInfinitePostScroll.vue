<script setup lang="ts">
import { getPosts } from '@/modules/user/api/api/get-posts';
import { ref } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import UserPostComponent from '@/modules/user/components/UserPostComponent.vue';
import type { Post } from '@/models/post-model';

const listElement = ref(null);
const postsToShow = 10;
const postList = ref<Post[]>(await getPosts(0, postsToShow));
const fetchingData = ref(false);

const getPostsOnScroll = async () => {
  fetchingData.value = true;
  const newPosts = await getPosts(postList.value.length, postsToShow);
  fetchingData.value = false;

  postList.value.push(newPosts);
};

useInfiniteScroll(
  listElement,
  async () => {
    try {
      await getPostsOnScroll();
    } catch (err) {}
  },
  { distance: 50 }
);
</script>
<template>
  <div>
    <ol ref="listElement" class="post-list">
      <li v-for="post in postList" v-bind:key="post.authorId">
        <UserPostComponent :post="post"></UserPostComponent>
      </li>
      <p v-show="fetchingData">Fetching...</p>
    </ol>
  </div>
</template>
<style lang="scss" scoped>
.post-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
