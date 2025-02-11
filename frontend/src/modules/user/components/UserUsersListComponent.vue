<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '@/modules/user/models/user-model';
import { API_URL } from '@/config/env';
import axios from 'axios';
import UserCardComponent from './UserCardComponent.vue';

interface UserListProps {
  listType: 'block' | 'follow' | 'mute';
}

const props = defineProps<UserListProps>();
const usersList = ref<User[]>(
  (await axios.get(`${API_URL}/user/${props.listType}`)).data
);
const displayList = ref(false);

const switchListDisplay = () => {
  displayList.value = !displayList.value;
};

const filterUsers = (username: string) => {
  usersList.value = usersList.value.filter((user) => user.username !== username);
};
</script>

<template>
  <div class="users-list-wrapper">
    <button
      class="button-primary button-small button-no-background"
      @click="switchListDisplay"
    >
      Users {{ props.listType === 'mute' ? 'mut' : props.listType }}ed
    </button>
    <div class="users-list-tile-wrapper" :class="displayList ? 'display' : 'hidden'">
      <div class="users-list-header">
        <button @click="switchListDisplay" class="button-x button-small back-button">
          ×
        </button>
        <h3>Users {{ props.listType === 'mute' ? 'mut' : props.listType }}ed</h3>
      </div>
      <ul class="users-list">
        <li v-for="user in usersList" v-bind:key="user.id" class="flex">
          <UserCardComponent
            :user="user"
            :action-type="listType"
            @remove-user-from-list="filterUsers"
          ></UserCardComponent>
        </li>
      </ul>
      <div v-show="usersList.length === 0" class="no-users-message font-grey">
        No users {{ props.listType === 'mute' ? 'mut' : props.listType }}ed
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.users-list-tile-wrapper {
  @extend %reset-ordered-list;
  background-color: black;
  box-shadow: 0 0 1rem #ffffff33;
  border-radius: 0.5rem;
  padding: 1.5rem;
  opacity: 0;
  position: absolute;
  z-index: -100;

  &.display {
    opacity: 1;
    z-index: 1000;
  }

  ul {
    margin: 0;
    padding: 0;
  }
}

.flex {
  display: flex;
}

.users-list-wrapper {
  position: relative;
}

.users-list-header {
  width: 100%;
  min-width: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-bottom: 0.5rem;

  h3 {
    margin: 0;
    padding: 0 2rem;
    color: white;
  }

  .back-button {
    left: -0.5rem;
    color: white;
    position: absolute;
  }
}

.no-users-message {
  font-size: 0.875rem;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
