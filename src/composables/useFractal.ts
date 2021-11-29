import type * as FRCTL from '@/types/fractal';
import { useEventListener } from '@/composables/useEventListener';
import { useFractalStore } from '@/stores/fractal';
import { useStyleStore } from '@/stores/style';
import { throwIf } from '@/utils/error';
import { ref, onMounted, onUnmounted } from 'vue';
import Pen from '@/libs/Pen';

// used for defining a draw handler in each src/core/alogrithms/*.ts file.
// the defined callback will be executed within a the worker thread.
export const defineFractal = <State>(handler: FRCTL.DrawHandler<State>) => handler;

export const useFractal = <State extends FRCTL.BaseState>(opts: FRCTL.Options<State>): FRCTL.Return<State> => {
    const renderer = ref<HTMLCanvasElement>();
    const fractalState = useFractalStore();
    const fractalStyles = useStyleStore();

    fractalState.fresh(opts.state);

    const renderFractal = () => {
        throwIf(!renderer.value, 'Cannot find canvas element for rendering fractal');
        const pen = Pen.fromStyles(renderer.value!, fractalStyles);

        const startTime = performance.now();
        opts.drawHandler.call({}, pen, fractalState.$state as State);
        const endTime = performance.now();
        const executionDuration = endTime - startTime;

        if (executionDuration > 10) {
            console.warn(`Fractal rendering took ${Math.round(executionDuration * 1000) / 1000}ms`);
        }
    }

    const storeObserver = [
        fractalStyles.$subscribe(renderFractal),
        fractalState.$subscribe((mut) => {
            if (!mut.events || mut.type === 'patch function' || Array.isArray(mut.events)) return;
            if (opts.ignore?.includes(mut.events.key)) return;
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