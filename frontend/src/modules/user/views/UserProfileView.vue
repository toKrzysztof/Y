<script setup lang="ts">
import BlockedUsersListComponent from '../components/BlockedUsersListComponent.vue';
import FollowedUsersListComponent from '../components/FollowedUsersListComponent.vue';
import MutedUsersListComponent from '../components/MutedUsersListComponent.vue';
import UserInfiniteOwnPostsScroll from '../components/UserInfiniteOwnPostsScroll.vue';
</script>

<template>
  <h1>My profile</h1>

  <Suspense>
    <FollowedUsersListComponent></FollowedUsersListComponent>
    <template #fallback><p>Loading...</p></template>
  </Suspense>
  <Suspense>
    <MutedUsersListComponent></MutedUsersListComponent>
    <template #fallback><p>Loading...</p></template>
  </Suspense>
  <Suspense>
    <BlockedUsersListComponent></BlockedUsersListComponent>
    <template #fallback><p>Loading...</p></template>
  </Suspense>
  <Suspense>
    <UserInfiniteOwnPostsScroll></UserInfiniteOwnPostsScroll>
  </Suspense>
</template>
