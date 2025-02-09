import LandingPageView from '@/modules/home/views/LandingPageView.vue';
import type { RouteRecordRaw } from 'vue-router';

export const HOME_ROUTES: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Landing-page',
    component: LandingPageView
  }
];
