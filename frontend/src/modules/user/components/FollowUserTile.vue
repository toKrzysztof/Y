<script setup lang="ts">
import { API_URL } from '@/config/env';
import axios from 'axios';

const props = defineProps<{ username: string }>();
const onClick = (username: string) => {
  axios.post(`${API_URL}/user/follow/${username}`).then(console.log).catch(console.log);
};
</script>
<template>
  <div>
    <span>{{ username }}</span
    ><button @click="() => onClick(username)" class="button-small">follow</button>
  </div>
</template>
<style lang="scss" scoped>
.test {
}
</style>
