<script setup lang="ts">
import { API_URL } from '@/config/env';
import router from '@/router';
import axios from 'axios';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

const submit = ({ firstName, lastName, username, password }: RegisterFormData) => {
  axios
    .post(`${API_URL}/auth/register`, { firstName, lastName, username, password })
    .then(() => {
      router.push('/login');
    })
    .catch((e) => {
      console.log(`e: ${e}`);
    });
};
</script>

<template>
  <article class="register-form-panel">
    <h1>Register</h1>
    <FormKit type="form" :actions="false" @submit="submit">
      <FormKit
        type="text"
        label="Username"
        name="username"
        validation="required|length:5,15|alphanumeric"
      />
      <div>
        <FormKit
          type="password"
          name="password"
          label="Password"
          validation="required"
        />
        <FormKit
          type="password"
          name="password_confirm"
          label="Confirm password"
          validation="required|confirm"
          validation-label="Password confirmation"
        />
      </div>
      <FormKit type="submit" />
    </FormKit>
  </article>
</template>
