import type * as FRCTL from '@/types/fractal';
import { ref, onMounted, onUnmounted } from 'vue';
import useEventListener from '@/composables/useEventListener';
import { useFractalStore } from '@/stores/fractal';
import { useStyleStore } from '@/stores/style';
import { throwIf } from '@/utils/error';
import Pen from '@/libs/Pen';

// used for defining a draw handler in each src/core/alogrithms/*.ts file.
// the defined callback will be executed within a the worker thread.
export const defineFractal = <State>(handler: FRCTL.DrawHandler<State>) => handler;

const useFractal = <State extends FRCTL.BaseState>(opts: FRCTL.Options<State>): FRCTL.Return<State> => {
    const renderer = ref<HTMLCanvasElement>();
    const fractalState = useFractalStore();
    const fractalStyles = useStyleStore();

    fractalState.fresh(opts.state);

    const renderFractal = () => {
        throwIf(!renderer.value, 'Cannot find canvas element for rendering fractal');
        const pen = Pen.fromStyles(renderer.value!, fractalStyles);
        opts.drawHandler.call({}, pen, fractalState.$state as State);
    }

    const storeObserver = [
        fractalStyles.$subscribe(renderFractal),
        fractalState.$subscribe((mut) => {
            if (mut.type === 'patch function' || Array.isArray(mut.events)) return;
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

    // const generateImage = (isPreview: boolean) => {
    //     const imageData: FRCTL.ExportMessage<State> = {
    //         fractal: 'hfractal',
    //         state: { ...state },
    //         config: { ...store.config },
    //         isPreview,
    //     };

    //     imageWorker.post(imageData);
    // }

    // const imageWorker = useWorker(ImageWorker, {
    //     terminateAfter: 15000 // terminate worker after 15 seconds of inactivity
    // });

    // imageWorker.on<FRCTL.SaveMessage>(({ data: image }) => {
    //     if (image.error) return console.log('oops');
    //     if (!image.isPreview) {
    //         return downloadBlob(image.blob, image.fileName);
    //     }

    //     emitter.emit('fractal:previewBlob', image.blob);
    // });
}

export default useFractal;