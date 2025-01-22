// import './assets/scss/global.scss';

import { createApp } from 'vue';
import { plugin, defaultConfig } from '@formkit/vue';
import App from './App.vue';
import router from './router';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formattedDate: (isoString: string) => string;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $route: RouteLocationNormalizedLoaded;
    $router: Router;
  }
}

const app = createApp(App);

app.mixin({
  computed: {
    $formattedDate() {
      return (isoString: string): string => {
        const date = new Date(isoString);
        const formattedDate = date.toISOString().slice(0, 10);
        const formattedTime = date.toTimeString().slice(0, 8);
        return `${formattedDate}, ${formattedTime}`;
      };
    }
  }
});

app.use(router);
app.use(plugin, defaultConfig);
app.mount('#app');
