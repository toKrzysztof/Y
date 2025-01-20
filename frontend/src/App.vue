<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="wrapper">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
// @import '@/assets/scss/global.scss';

.wrapper {
  height: 100vh;
  align-items: center;
  display: flex;
  flex-direction: column;
}
</style>
