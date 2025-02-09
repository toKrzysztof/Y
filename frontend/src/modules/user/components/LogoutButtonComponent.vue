<script setup lang="ts">
import { API_URL } from '@/config/env';
import router from '@/router';
import axios from 'axios';

const onClick = async () => {
  axios
    .post(`${API_URL}/auth/logout`)
    .then(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('followedUsers');
      localStorage.removeItem('blockedUsers');
      router.push('/home');
    })
    .catch(console.log);
};
</script>
<template>
  <div class="button-box">
    <button v-on:click="onClick" class="button-primary">Logout</button>
  </div>
</template>
<style lang="scss" scoped>
.button-box {
  display: flex;
  justify-content: center;
}
</style>
