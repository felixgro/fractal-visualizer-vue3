import { defineStore } from 'pinia';

export const useFractalStore = defineStore('state', {
    state: () => {
        return {} as { [key: string]: any }
    },

    actions: {
        clear() {
            for (const key of Object.keys(this.$state)) {
                delete this.$state[key];
            }
        },

        fresh(state: { [key: string]: any }) {
            this.clear();
            this.$state = state;
        }
    }
});