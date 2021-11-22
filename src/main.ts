import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/components/App.vue';
import registerPolyfills from '@/utils/polyfills';
import router from '@/plugins/router';
import emitter from '@/plugins/emitter';

// loads all necessary polyfills
registerPolyfills();

const app = createApp(App);
const pinia = createPinia();

app.use(router);     // loads all modules located in src/core/fractals dynamically as routes
app.use(emitter);    // enables emitting and listening for global events
app.use(pinia);

app.mount('#app');