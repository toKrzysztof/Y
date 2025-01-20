import LandingPageView from '@/modules/home/views/LandingPageView.vue';
import LoginView from '@/modules/home/views/LoginView.vue';
import RegisterView from '@/modules/home/views/RegisterView.vue';
import type { RouteRecordRaw } from 'vue-router';

export const HOME_ROUTES: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Landing-page',
    component: LandingPageView
  },
  {
    path: 'login',
    name: 'Login',
    component: LoginView
  },
  {
    path: 'register',
    name: 'Register',
    component: RegisterView
  }
];
