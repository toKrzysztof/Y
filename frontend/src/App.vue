<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { API_URL } from './config/env';
console.log('TEST', API_URL);
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
