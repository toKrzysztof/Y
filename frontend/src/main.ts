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
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
          return `${diffInSeconds}s`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
          return `${diffInMinutes}m`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
          return `${diffInHours}h`;
        }

        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      };
    }
  }
});

app.use(router);
app.use(plugin, defaultConfig);
app.mount('#app');
