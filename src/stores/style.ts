import { defineStore } from 'pinia';

export const useStyleStore = defineStore('styles', {
    state: () => ({
        bg: '#ffffff',
        fg: '#000000',
        lw: .3,
    })
});