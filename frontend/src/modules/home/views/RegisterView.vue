<script setup lang="ts">
import { ref, computed } from 'vue';
import { API_URL } from '@/config/env';
import router from '@/router';
import axios from 'axios';

interface RegisterFormData {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const form = ref<RegisterFormData>({
  name: '',
  username: '',
  password: '',
  confirmPassword: ''
});

const errors = ref<Partial<Record<keyof RegisterFormData, string>>>({});

const validateField = (field: keyof RegisterFormData) => {
  switch (field) {
    case 'name':
      if (!form.value.name.trim()) {
        errors.value.name = 'Name is required.';
      } else {
        delete errors.value.name;
      }
      break;

    case 'username':
      if (!form.value.username.trim()) {
        errors.value.username = 'Username is required.';
      } else if (form.value.username.length < 3) {
        errors.value.username = 'Username must be at least 3 characters.';
      } else {
        delete errors.value.username;
      }
      break;

    case 'password':
      if (!form.value.password.trim()) {
        errors.value.password = 'Password is required.';
      } else if (form.value.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters.';
      } else {
        delete errors.value.password;
      }
      break;

    case 'confirmPassword':
      if (!form.value.confirmPassword.trim()) {
        errors.value.confirmPassword = 'Please confirm your password.';
      } else if (form.value.confirmPassword !== form.value.password) {
        errors.value.confirmPassword = 'Passwords do not match.';
      } else {
        delete errors.value.confirmPassword;
      }
      break;
  }
};

const isFormValid = computed(() => {
  return (
    form.value.name.trim() &&
    form.value.username.trim() &&
    form.value.password.trim() &&
    form.value.confirmPassword.trim() &&
    form.value.password === form.value.confirmPassword
  );
});

const submit = () => {
  if (!isFormValid.value) return;

  const { name, username, password } = form.value;
  axios
    .post(`${API_URL}/auth/register`, { name, username, password })
    .then(() => {
      router.push('/user/my-feed');
    })
    .catch((e) => {
      console.log(`e: ${e}`);
    });
};
</script>

<template>
  <article class="register-form-panel">
    <form @submit.prevent="submit" class="register-form">
      <div class="input-wrapper">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Enter your name"
          @blur="validateField('name')"
        />
        <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      </div>

      <div class="input-wrapper">
        <label for="username">Username</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          placeholder="Enter your username"
          @blur="validateField('username')"
        />
        <div v-if="errors.username" class="error-message">
          {{ errors.username }}
        </div>
      </div>

      <div class="input-wrapper">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Enter your password"
          @blur="validateField('password')"
        />
        <div v-if="errors.password" class="error-message">
          {{ errors.password }}
        </div>
      </div>

      <div class="input-wrapper">
        <label for="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirm your password"
          @blur="validateField('confirmPassword')"
        />
        <div v-if="errors.confirmPassword" class="error-message">
          {{ errors.confirmPassword }}
        </div>
      </div>

      <button
        type="submit"
        class="button-primary register-button"
        :disabled="!isFormValid"
      >
        Continue
      </button>
    </form>
  </article>
</template>

<style lang="scss" scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;

  .input-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .error-message {
      color: red;
      font-size: 0.875rem;
    }
  }

  .register-button {
    width: 100%;
  }
}
</style>
