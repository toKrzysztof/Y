<script setup lang="ts">
import UserSidebarComponent from './UserSidebarComponent.vue';
import { useSocket } from '../composables/useSocket';
import { onUnmounted } from 'vue';
import { useInfiniteScrollStore } from '../store/infiniteScrollStore';

const infiniteScrollStore = useInfiniteScrollStore();

const { socket } = useSocket();

socket.emit('listen-for-posts');

socket.on('new-post', (post) => {
  infiniteScrollStore.addPost(post);
});

onUnmounted(() => {
  socket.disconnect();
});
</script>
<template>
  <div class="user-page">
    <UserSidebarComponent></UserSidebarComponent>
    <main class="user-page-content">
      <RouterView :key="$route.fullPath"></RouterView>
    </main>
  </div>
</template>
<style lang="scss" scoped>
.user-page {
  display: flex;
  height: 100vh;
  width: 100%;
}

.user-page-content {
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
}
</style>
