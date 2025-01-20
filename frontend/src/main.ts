// import './assets/scss/global.scss';

import { createApp } from 'vue';
import { plugin, defaultConfig } from '@formkit/vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.use(plugin, defaultConfig);
app.mount('#app');
