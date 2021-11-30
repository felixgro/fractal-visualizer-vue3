import { defineStore } from 'pinia';
import { useFractalStore } from './fractal';
import { ref } from 'vue';

// debugStore.setExecutionDuration(endTime - startTime);
//         debugStore.setIterations(fractalState.steps);
const getIterations = (steps: number): number => {
    if (steps <= 0) return 1;
    return getIterations(steps - 1) * 2 + 1;
}

export const useDebugStore = defineStore('debug', () => {
    const iterations = ref<number>();
    const frameDuration = ref<number>();

    const fractalState = useFractalStore();

    const setExecutionDuration = (duration: number) => {
        frameDuration.value = Math.round(duration * 10000) / 10000;
        iterations.value = getIterations(fractalState.$state.step);
    };

    return {
        iterations,
        frameDuration,
        setExecutionDuration
    }
});