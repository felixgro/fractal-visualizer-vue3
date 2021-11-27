import { getBrightness } from '@/utils/color';
import { defineStore } from 'pinia';

export const useStyleStore = defineStore('styles', {
    state: () => ({
        bg: '#ffffff',
        fg: '#000000',
        lw: .3,
    }),

    getters: {
        isDark: (state) => {
            const brightness = getBrightness(state.bg);
            return brightness < .5;
        }
    }
});