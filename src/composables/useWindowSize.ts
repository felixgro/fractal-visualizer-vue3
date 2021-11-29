import { ref } from 'vue';
import { useEventListener } from './useEventListener';

export const useWindowSize = () => {
    const width = ref<number>(0);
    const height = ref<number>(0);

    const updateSize = () => {
        if (!window) return;
        width.value = window.innerWidth;
        height.value = window.innerHeight;
    }

    updateSize();
    useEventListener(window, 'resize', updateSize);

    return { width, height };
}
