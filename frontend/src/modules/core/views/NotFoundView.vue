<script setup lang="ts">
import router from '@/router';

const goBack = () => {
  router.back();
};
</script>
<template>
  <button @click="goBack">Back</button>
  <RouterLink to="/">Home</RouterLink>
  <h1>404 - page not found!</h1>
</template>
