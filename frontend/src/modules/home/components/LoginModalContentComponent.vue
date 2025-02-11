<script setup lang="ts">
import { ref, computed } from 'vue';
import { API_URL } from '@/config/env';
import router from '@/router';
import axios from 'axios';
import { setLoggedInUserState } from '@/modules/user/utils/localStorageUtils';

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

const loginError = ref<string | null>(null);

const submit = (credentials: LoginCredentials) => {
  axios
    .post(`${API_URL}/auth/login`, credentials)
    .then((res) => {
      localStorage.clear();
      setLoggedInUserState(
        res.data.userId,
        res.data.name,
        res.data.username,
        JSON.stringify(res.data.followedUsers),
        JSON.stringify(res.data.blockedUsers),
        JSON.stringify(res.data.mutedUsers)
      );
      router.push('/user/my-feed');
    })
    .catch((e) => {
      if (e.status === 401) {
        loginError.value = 'Provided login or password is incorrect.';
      }
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
      <div v-if="loginError" class="error-message">
        {{ loginError }}
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
