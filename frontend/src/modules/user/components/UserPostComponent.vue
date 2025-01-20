<script setup lang="ts">
import type { Post } from '@/models/post-model';

const props = defineProps<{ post: Post }>();
</script>
<template>
  <article>
    <h3>{{ post.title }}</h3>
    <p>{{ post.content }}</p>
    <span>{{ post.createdAt }}</span>
  </article>
</template>
