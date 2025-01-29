<script setup lang="ts">
import LogoutButtonComponent from './LogoutButtonComponent.vue';
</script>
<template>
  <div class="sidebar">
    <ul class="navigation">
      <li>
        <a class="link-icon" href="/user/create-post">
          <span>Create post</span>
        </a>
      </li>
      <li>
        <!-- TODO - swap for routerlink -->
        <a class="link-icon" href="/user/my-feed">
          <span>My feed</span>
        </a>
      </li>
      <li>
        <a class="link-icon" href="/user/explore">
          <span>Explore</span>
        </a>
      </li>
      <li>
        <a class="link-icon" href="/user/chat">
          <span>Chat</span>
        </a>
      </li>
      <li>
        <a class="link-icon" href="/user/profile">
          <span>My profile</span>
        </a>
      </li>
    </ul>
    <LogoutButtonComponent />
  </div>
</template>
<style lang="scss" scoped>
.sidebar {
  box-sizing: border-box;
  max-width: 20rem;
  background-color: white;
  border-right: 0.0625rem solid rgb(185, 185, 185);
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 3rem 1rem;
  justify-content: space-between;
  position: relative;
}

.navigation {
  padding: 0rem;
  margin: 0rem;
  display: grid;
  gap: 1rem;
  list-style: none;
}
</style>
