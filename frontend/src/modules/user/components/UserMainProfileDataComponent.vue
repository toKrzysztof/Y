<script setup lang="ts">
import { API_URL } from '@/config/env';
import router from '@/router';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import UserActions from './UserActions.vue';
import UserUsersListComponent from './UserUsersListComponent.vue';

const route = useRoute();
const username = route.params.username;
const ownUsername = localStorage.getItem('username');

const user = ref({ username: '', name: '' });

const routeBack = () => {
  router.back();
};

onMounted(() => {
  axios
    .get(`${API_URL}/user/profile/${username}`)
    .then((res) => {
      user.value.name = res.data.name;
      user.value.username = res.data.username;
    })
    .catch(console.log);
});
</script>
<template>
  <div class="profile-data">
    <header class="header">
      <button class="button-small button-primary" @click="routeBack">
        <i class="icon-chevron-left"></i>
      </button>
      <div class="user-data">
        <h3>
          <span>{{ user.name }}</span
          ><span class="font-grey"> @{{ user.username }}</span>
        </h3>
        <UserActions
          :name="user.name"
          :username="user.username"
          v-if="user.username !== ''"
        ></UserActions>
      </div>
    </header>
    <div class="bottom-user-menu" v-if="username === ownUsername">
      <Suspense>
        <UserUsersListComponent :list-type="'follow'" />
        <template #fallback><p>Loading...</p></template>
      </Suspense>
      <Suspense>
        <UserUsersListComponent :list-type="'mute'" />
        <template #fallback><p>Loading...</p></template>
      </Suspense>
      <Suspense>
        <UserUsersListComponent :list-type="'block'" />
        <template #fallback><p>Loading...</p></template>
      </Suspense>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.profile-data {
  box-sizing: border-box;
  width: 100%;
  max-width: 38rem;
}

.header {
  box-sizing: border-box;
  padding: 0.5rem 0.25rem 1.5rem;
  width: 100%;
  max-width: 38rem;
  display: flex;
  align-items: center;
  position: relative;
  border-right: 0.0625rem solid $border-grey;

  button {
    position: absolute;
  }
}

.user-data {
  align-items: center;
  display: flex;
  margin: auto;
  gap: 1rem;
}

.bottom-user-menu {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  border-right: 0.0625rem solid $border-grey;
}
</style>
