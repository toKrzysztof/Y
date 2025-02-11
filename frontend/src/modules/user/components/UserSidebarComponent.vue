<script setup lang="ts">
import UserLogoutButtonComponent from './UserLogoutButtonComponent.vue';

const ownUsername = localStorage.getItem('username');
</script>
<template>
  <div class="sidebar">
    <ul class="navigation">
      <li class="nav-link">
        <RouterLink class="link-primary link-icon" to="/user/my-feed">
          <i class="pi pi-home"></i>
          <span>Feed</span>
        </RouterLink>
      </li>
      <li class="nav-link">
        <RouterLink class="link-primary link-icon" to="/user/explore">
          <i class="pi pi-compass"></i>
          <span>Explore</span>
        </RouterLink>
      </li>
      <!-- <li class="nav-link">
        <RouterLink class="link-primary link-icon" to="/user/chat">
          <i class="pi pi-comments"></i>
          <span>Chat</span>
        </RouterLink>
      </li> -->
      <li class="nav-link">
        <RouterLink class="link-primary link-icon" :to="`/user/${ownUsername}`">
          <i class="pi pi-user"></i>
          <span>Profile</span>
        </RouterLink>
      </li>
      <li class="logout-button"><UserLogoutButtonComponent /></li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.sidebar {
  align-items: flex-end;
  box-sizing: border-box;
  border-right: 0.0625rem solid $border-grey;
  max-width: calc(50% - 20rem);
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 3rem 2rem;
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

.nav-link {
  height: fit-content;

  i {
    font-size: 1.25rem;
  }
}

.logout-button {
  margin-top: auto;
}
</style>
