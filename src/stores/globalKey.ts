import { defineStore } from 'pinia';
import { useFractalStore } from './fractal';
import { ref, computed } from 'vue';


export const useGlobalKeyStore = defineStore('globalKey', () => {
    const key = ref('');
    const fractalStore = useFractalStore();

    const increment = () => {
        fractalStore.$patch({
            [key.value]: fractalStore.$state[key.value] + 1
        })
    }

    const decrement = () => {
        //@ts-ignore
        fractalStore.$patch({
            [key.value]: fractalStore.$state[key.value] - 1
        });
    }

    const value = computed(() => {
        return fractalStore.$state[key.value];
    });

    return { key, increment, decrement, value };
});