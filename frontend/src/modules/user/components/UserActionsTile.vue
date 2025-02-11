<script setup lang="ts">
import UserActions from './UserActions.vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ name: string; username: string }>();
</script>

<template>
  <div class="user-actions-tile">
    <div class="user-header">
      <div class="user-name">{{ name }}</div>
      <UserActions :name="name" :username="username"></UserActions>
    </div>
    <RouterLink class="user-username font-grey" :to="`/user/${username}`"
      >@{{ username }}</RouterLink
    >
  </div>
</template>

<style lang="scss" scoped>
.user-comment-author-username {
  font-weight: 700;
}

.user-username {
  width: fit-content;
}

.user-name {
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.user-header {
  align-items: center;
  gap: 0.75rem;
  display: flex;
  padding-bottom: 0.25rem;
}

.user-actions-tile {
  opacity: 0;
  padding: 1rem;
  border-radius: 0.5rem;
  position: absolute;
  background-color: black;
  box-shadow: 0 0 0.625rem #ffffff33;
  top: -100%;
  transition: 200ms ease-in;
  z-index: -100;

  :hover {
    opacity: 1;
  }
}

:deep(.user-actions) {
  padding-bottom: 0.25rem;
}
</style>
