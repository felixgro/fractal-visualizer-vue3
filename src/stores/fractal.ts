import { defineStore, acceptHMRUpdate } from 'pinia';

export const useStore = defineStore('fractal', {
    state: () => ({
        bg: '#ffffff',
        fg: '#000000',
        lw: 1,
        width: 700,
        height: 1000,
        format: 'image/png'
    }),
    getters: {
        styles: ({ bg, fg, lw }) => ({ bg, fg, lw }),
        config: ({ width, height, format, bg, fg, lw }) => ({ width, height, format, bg, fg, lw }),
    },
    actions: {},
});

// for vite's hot module replacement:
// if (import.meta.hot) {
//     import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
// }
// FIXME: this leads to an error in the image worker thread because it appends dom code in each algorithm which are getting called in the worker environment