import type { RouteRecordRaw } from 'vue-router';
import UserExploreView from './views/UserExploreView.vue';
import UserChatView from './views/UserChatView.vue';
import UserFeedView from './views/UserFeedView.vue';
import UserProfileView from './views/UserProfileView.vue';
import UserMetadataFormView from './views/UserMetadataFormView.vue';
import UserPostThreadView from './views/UserPostThreadView.vue';
import { userAuthenticatedGuard } from '../core/guards/userAuthenticatedGuard';

export const USER_ROUTES: RouteRecordRaw[] = [
  {
    path: 'my-feed',
    name: 'My-feed',
    component: UserFeedView,
    beforeEnter: userAuthenticatedGuard
  },
  {
    path: 'explore',
    name: 'Explore',
    component: UserExploreView,
    beforeEnter: userAuthenticatedGuard
  },
  {
    path: 'chat',
    name: 'Chat',
    component: UserChatView,
    beforeEnter: userAuthenticatedGuard
  },
  {
    path: ':username',
    name: 'Profile',
    component: UserProfileView,
    children: [
      {
        path: 'settings',
        name: 'Settings',
        component: UserMetadataFormView
      }
    ],
    beforeEnter: userAuthenticatedGuard
  },
  {
    path: 'post/:postId',
    name: 'Post-thread',
    component: UserPostThreadView,
    props: true,
    beforeEnter: userAuthenticatedGuard
  }
];
