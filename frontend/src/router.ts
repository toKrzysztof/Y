import { createRouter, createWebHistory } from 'vue-router';
import NotFoundView from '@/modules/core/views/NotFoundView.vue';
import { USER_ROUTES } from '@/modules/user/user-routes';
import { userAuthenticatedGuard } from '@/modules/core/guards/userAuthenticatedGuard';
import { HOME_ROUTES } from '@/modules/home/home-routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/modules/home/components/HomeWrapperComponent.vue'),

      children: HOME_ROUTES
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('@/modules/user/components/UserWrapperComponent.vue'),
      children: USER_ROUTES,
      beforeEnter: userAuthenticatedGuard
    }
  ]
});

export default router;
