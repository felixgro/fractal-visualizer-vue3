import { defineStore } from 'pinia';

export const useExportStore = defineStore('export', {
    state: () => ({
        width: 1000,
        height: 1000,
        format: 'image/png'
    }),

    getters: {
        extension: (s) => s.format.split('/')[1]
    }
});