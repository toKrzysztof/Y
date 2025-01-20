<script setup lang="ts"></script>

<template>
  <header>
    <nav class="x-center">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/home/login">Login</RouterLink>
      <RouterLink to="/home/register">Register</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.x-center {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
