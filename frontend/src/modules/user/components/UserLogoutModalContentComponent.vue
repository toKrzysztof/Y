<script setup lang="ts">
import { API_URL } from '@/config/env';
import router from '@/router';
import axios from 'axios';
import { inject } from 'vue';

const closeModal = inject<() => void>('closeModal');

const logout = async () => {
  axios
    .post(`${API_URL}/auth/logout`)
    .then(() => {
      localStorage.clear();
      router.push('/');
    })
    .catch(console.log);
};
</script>
<template>
  <div class="buttons-box">
    <button class="button-secondary" @click="logout">Yes</button>
    <button class="button-primary" @click="closeModal">No</button>
  </div>
</template>
<style lang="scss" scoped>
.buttons-box {
  display: flex;
  justify-content: center;
  gap: 3rem;
}
</style>
