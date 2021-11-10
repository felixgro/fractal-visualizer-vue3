import { createApp } from 'vue';
import router from './plugins/router';
import emitter from './plugins/emitter';
import App from './core/App.vue';

const app = createApp(App);

app.use(router);
app.use(emitter);

app.mount('#app');
