import type * as FRCTL from '@/types/fractal';
import { useEventListener } from '@/composables/useEventListener';
import { useFractalStore } from '@/stores/fractal';
import { useDebugStore } from '@/stores/debug';
import { useStyleStore } from '@/stores/style';
import { throwIf } from '@/utils/error';
import { ref, onMounted, onUnmounted } from 'vue';
import Pen from '@/libs/Pen';
import { isArray } from '@vue/shared';

// used for defining a draw handler in each src/core/alogrithms/*.ts file.
// the defined callback will be executed within a the worker thread.
export const defineFractal = <State>(handler: FRCTL.DrawHandler<State>) => handler;

const getIterations = (steps: number): number => {
    if (steps === 0) return 1;
    return getIterations(steps - 1) * 2 + 1;
}

export const useFractal = <State extends FRCTL.BaseState>(opts: FRCTL.Options<State>): FRCTL.Return<State> => {
    const renderer = ref<HTMLCanvasElement>();
    const fractalState = useFractalStore();
    const fractalStyles = useStyleStore();
    const debugStore = useDebugStore();

    fractalState.fresh(opts.state);

    const renderFractal = () => {
        throwIf(!renderer.value, 'Cannot find canvas element for rendering fractal');
        const pen = Pen.fromStyles(renderer.value!, fractalStyles);

        const startTime = performance.now();
        opts.drawHandler.call({}, pen, fractalState.$state as State);
        const endTime = performance.now();

        debugStore.setExecutionDuration(endTime - startTime);
    }

    const storeObserver = [
        fractalStyles.$subscribe(renderFractal),
        fractalState.$subscribe((mut) => {
            // TODO: refactor this!
            // prevent rendering fractal when route changes
            if (Array.isArray(mut.events) && mut.events.length > 1 && mut.type !== 'direct') return;
            // prevent double rendering on start
            if (!mut.events || mut.type === 'patch object') return;
            // prevent rendering when ignored state changes
            if (!Array.isArray(mut.events) && opts.ignore?.includes(mut.events.key))
                return;

            renderFractal();
        })
    ]

    onMounted(() => {
        renderer.value = document.querySelector('.fractalRenderer') as HTMLCanvasElement;
        renderFractal();
    });

    onUnmounted(() => {
        storeObserver.forEach((removeObserver) => removeObserver());
    });

    useEventListener(window, 'resize', renderFractal);

    return { state: fractalState.$state };
}