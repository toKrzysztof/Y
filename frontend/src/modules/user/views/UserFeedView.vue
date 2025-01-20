<script setup lang="ts">
import InfiniteUserScrollComponent from '@/modules/user/components/InfiniteUserScrollComponent.vue';
</script>

<template>
  PostList works!
  <Suspense>
    <InfiniteUserScrollComponent />
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>
