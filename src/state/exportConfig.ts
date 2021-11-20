import { defineStore } from 'pinia';

export const useStore = defineStore('export', {
    state: () => ({
        width: 100,
        height: 100,
        format: 'image/png'
    }),
    getters: {},
    actions: {},
});
