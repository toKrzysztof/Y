<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InfiniteScrollPageComponent from '../components/InfiniteScrollPageComponent.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { API_URL } from '@/config/env';
import { getCommentThreadReplies } from '../api/get-comment-thread-replies';
import UserMainCommentComponent from '../components/UserMainCommentComponent.vue';
import UserCommentListComponent from '../components/UserCommentListComponent.vue';
import type { Comment } from '../models/comment-model';
import router from '@/router';
import { isUserBlocked } from '../utils/userRelationshipsStorageUtils';

const comment = ref({
  id: '',
  username: '',
  content: '',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01'
});
const route = useRoute();
const commentId = route.params.commentId;
console.log(commentId);

onMounted(() => {
  axios
    .get(`${API_URL}/user/comment/${commentId}`)
    .then((res) => {
      comment.value = res.data;
    })
    .catch(console.log);
});

const routeBack = () => {
  router.back();
};
</script>
<template>
  <button @click="routeBack" class="button-small">Back</button>
  <InfiniteScrollPageComponent
    :fetch-data="getCommentThreadReplies"
    :posts-per-page="10"
    :base-fetch-url="`${API_URL}/user/comment/${commentId}/comment`"
  >
    <template #regular-content>
      <UserMainCommentComponent :comment="comment"></UserMainCommentComponent>
    </template>
    <template #itemList="{ itemList }">
      <UserCommentListComponent
        :comment-list="(itemList as Comment[]).filter(comment => !isUserBlocked(comment.username))"
      ></UserCommentListComponent>
    </template>
  </InfiniteScrollPageComponent>
</template>
<style lang="scss" scoped>
.apply {
}
</style>
