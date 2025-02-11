<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="wrapper">
    <RouterView />
  </div>
</template>

<style lang="scss">
// @import '@/assets/scss/global.scss';

.wrapper {
  color: white;
  height: 100vh;
  align-items: center;
  display: flex;
  flex-direction: column;
}
</style>
