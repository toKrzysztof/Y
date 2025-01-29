<script setup lang="ts">
import { API_URL } from '@/config/env';
import router from '@/router';
import axios from 'axios';

interface LoginCredentials {
  username: string;
  password: string;
}

const submit = ({ username, password }: LoginCredentials) => {
  axios
    .post(`${API_URL}/auth/login`, { username, password })
    .then((res) => {
      console.log(res);
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('followedUsers');
      localStorage.removeItem('blockedUsers');
      localStorage.setItem('userId', res.data.userId);
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
    <h1>Login</h1>
    <FormKit type="form" :actions="false" @submit="submit">
      <FormKit type="text" label="Username" name="username" />
      <div class="double">
        <FormKit
          type="password"
          name="password"
          label="Password"
          validation="required"
        />
      </div>
      <FormKit type="submit" />
    </FormKit>
  </article>
</template>
