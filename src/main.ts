import { createApp } from 'vue';
import App from '@/components/App.vue';
import registerPolyfills from '@/utils/polyfills';
import router from '@/plugins/router';
import emitter from '@/plugins/emitter';

// loads all necessary polyfills
registerPolyfills();

const app = createApp(App);

app.use(router);     // loads all modules located in src/core/fractals dynamically as routes
app.use(emitter);    // enables emitting and listening for global events

app.mount('#app');