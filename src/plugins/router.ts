import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from "vue-router";
import { getFileName } from '../utils/file';

// Lazy load all fractal control components located in core/controls/ to dynamically assign them
// as routes to the router. This constant is going to be an object with the modules pathname
// as key and an inline import method which loads the given module asynchronously as value.
// see: https://vitejs.dev/guide/features.html#glob-import
const fractalModules = import.meta.glob('../core/controls/*.vue');

// redirect default path / to first fractal
const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/HFractal' }
];

// dynamically add fractal modules as routes
for (const [path, module] of Object.entries(fractalModules)) {
    const name = getFileName(path, false);

    routes.push({
        name,
        path: `/${name}`,
        component: module,
    })
}

// Initialize router with dynamically generated routes.
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;