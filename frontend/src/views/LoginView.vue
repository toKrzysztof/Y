<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const username = ref('');
const password = ref('');

async function submit() {
  const res = await axios.post('http://localhost:3000/auth/login', {
    username: username.value,
    password: password.value
  });

  console.log(res);
}
</script>

<template>
  <section class="panel">
    <h1>Logowanie</h1>
    <form @submit.prevent="submit">
      <section>
        <label for="username">użytkownik</label>
        <input type="text" v-model="username" />
      </section>
      <section>
        <label for="password">hasło</label>
        <input type="text" v-model="password" />
      </section>
      <button type="submit">Zaloguj</button>
    </form>
    <p class="help">
      <span>Nie masz jeszcze konta?</span>
      <a href="/register">Zarejestruj się</a>
    </p>
  </section>
</template>
