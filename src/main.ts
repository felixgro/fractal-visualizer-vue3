import { createApp } from 'vue';
import router from '@/plugins/router';
import emitter from '@/plugins/emitter';
import App from '@/components/App.vue';

const app = createApp(App);

app.use(router);     // loads all modules located in src/core/fractals dynamically as routes
app.use(emitter);    // enables emitting and listening for global events

app.mount('#app');
