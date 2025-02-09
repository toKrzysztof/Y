<script setup lang="ts">
import type { User } from '@/modules/user/models/user-model';

const props = defineProps<{ user: User }>();
</script>
<template>
  <article class="flex">
    <span>{{ props.user.username }}</span
    >-
    <span>{{ props.user.name }}</span>
  </article>
</template>
<style lang="scss" scoped>
.flex {
  display: flex;
  gap: 0.5rem;
}
</style>
