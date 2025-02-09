<script setup lang="ts">
import router from '@/router';

const goBack = () => {
  router.back();
};
</script>
<template>
  <div class="navigation">
    <div>
      <button @click="goBack" class="button-primary">Back</button>
    </div>
    <div>
      <RouterLink to="/" class="link-primary">Home</RouterLink>
    </div>
  </div>
  <h1>404 - we couldn't find the page you were looking for...</h1>
</template>
<style lang="scss" scoped>
.navigation {
  padding-top: 1rem;
  align-items: center;
  display: flex;
  gap: 1rem;
}

h1 {
  margin-top: 10rem;
}
</style>
