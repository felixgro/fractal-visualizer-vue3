import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { getFileName } from '@/utils/file';

// This router extends the vue-router plugin (https://next.router.vuejs.org/guide) by
// dynamically generating named routes based on all component modules located in src/core/controls.
// Each component will get lazy-loaded once the correlating route get's visited.
// Route paths and names are created from reading the component's file name,
// for example reading HFractal.vue will result in the following route object:
// { path: '/hfractal', name: 'HFractal', component: () => import('@/core/controls/HFractal.vue') }
const getFractalRoutes = (): RouteRecordRaw[] => {
    const moduleImport = import.meta.glob('../core/controls/*.vue');

    return Object.entries(moduleImport).map(([path, component]) => {
        const name = getFileName(path, false);

        return {
            path: `/${name}`,
            component,
            name,
        } as RouteRecordRaw
    });
}

// initialize & export vue-router plguin for usage within vue.
export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/hfractal' },
        ...getFractalRoutes()
    ]
});