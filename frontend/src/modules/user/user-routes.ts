import type { RouteRecordRaw } from 'vue-router';
import UserPostFormView from './views/UserPostFormView.vue';
import UserExploreView from './views/UserExploreView.vue';
import UserChatView from './views/UserChatView.vue';
import UserFeedView from './views/UserFeedView.vue';
import UserProfileView from './views/UserProfileView.vue';
import UserMetadataFormView from './views/UserMetadataFormView.vue';

export const USER_ROUTES: RouteRecordRaw[] = [
  {
    path: 'my-feed',
    name: 'My-feed',
    component: UserFeedView
  },
  {
    path: 'create-post',
    name: 'Create-post',
    component: UserPostFormView
  },
  {
    path: 'explore',
    name: 'Explore',
    component: UserExploreView
  },
  {
    path: 'chat',
    name: 'Chat',
    component: UserChatView
  },
  {
    path: 'profile',
    name: 'Profile',
    component: UserProfileView,
    children: [
      {
        path: 'settings',
        name: 'Settings',
        component: UserMetadataFormView
      }
    ]
  }
];
