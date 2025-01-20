<script setup lang="ts">
import UserSidebarComponent from './UserSidebarComponent.vue';
</script>
<template>
  <div class="user-page">
    <UserSidebarComponent></UserSidebarComponent>
    <main class="user-page-content">
      <RouterView></RouterView>
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
