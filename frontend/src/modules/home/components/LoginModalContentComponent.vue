<script setup lang="ts">
import { ref, computed } from 'vue';
import { API_URL } from '@/config/env';
import router from '@/router';
import axios from 'axios';

interface LoginCredentials {
  username: string;
  password: string;
}

const form = ref<LoginCredentials>({
  username: '',
  password: ''
});

const isFormValid = computed(() => {
  return form.value.username.trim() !== '' && form.value.password.trim() !== '';
});

const submit = (credentials: LoginCredentials) => {
  axios
    .post(`${API_URL}/auth/login`, credentials)
    .then((res) => {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      localStorage.removeItem('followedUsers');
      localStorage.removeItem('blockedUsers');
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('followedUsers', JSON.stringify(res.data.followedUsers));
      localStorage.setItem('blockedUsers', JSON.stringify(res.data.blockedUsers));
      router.push('/user/my-feed');
    })
    .catch((e) => {
      console.log(`e: ${e}`);
    });
};
</script>

<template>
  <article class="login-form-panel">
    <form @submit.prevent="submit(form)" class="login-form">
      <div class="input-wrapper">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your name"
          v-model="form.username"
        />
      </div>
      <div class="input-wrapper">
        <label for="password">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          id="password"
          v-model="form.password"
        />
      </div>
      <button
        type="submit"
        class="button-primary login-button"
        :disabled="!isFormValid"
      >
        Continue
      </button>
    </form>
  </article>
</template>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;

  .login-button {
    width: 100%;
  }
}
</style>
