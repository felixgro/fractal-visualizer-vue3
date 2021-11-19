import type * as FRCTL from '@/types/fractal';
import { ref, reactive, onMounted, watch } from 'vue';
import ImageWorker from '@/core/ImageWorker?worker';
import useEventListener from '@/composables/useEventListener';
import useImageState from '@/composables/useImageState';
import useEmitter from '@/composables/useEmitter';
import useWorker from '@/composables/useWorker';
import { downloadBlob } from '@/utils/file';
import { watchScoped } from '@/utils/vue';
import { throwIf } from '@/utils/error';
import Pen from '@/libs/Pen';

// used for defining a draw handler in each src/core/alogrithms/*.ts file.
export const defineFractal = <State>(handler: FRCTL.DrawHandler<State>) => handler;

const useFractal = <State extends FRCTL.BaseState>(opts: FRCTL.Options<State>): FRCTL.Return<State> => {
    const state = reactive<State>(opts.state);
    const renderer = ref<HTMLCanvasElement>();

    const emitter = useEmitter();
    const imageState = useImageState();
    const imageWorker = useWorker(ImageWorker, {
        terminateAfter: 15000 // terminate worker after 15 seconds of inactivity
    });

    imageWorker.on<FRCTL.SaveMessage>(({ data: image }) => {
        downloadBlob(image.blob, image.fileName);
    });

    const renderFractal = () => {
        throwIf(!renderer.value, 'Cannot find canvas element for rendering fractal');

        const pen = Pen.fromStyles(renderer.value!, imageState.styles);
        opts.drawHandler.call({}, pen, state);
    }

    const saveFractal = () => {
        const imageData: FRCTL.ExportMessage<State> = {
            fractal: 'hfractal',
            state: { ...state },
            dimensions: imageState.getters.dimensions(),
            styles: imageState.getters.styles(),
            format: imageState.getters.format(),
        };

        imageWorker.post(imageData);
    };

    onMounted(() => {
        renderer.value = document.querySelector('.fractalRenderer') as HTMLCanvasElement;
        renderFractal();
        emitter.on('fractal:save', saveFractal);
    });

    useEventListener(window, 'resize', renderFractal);
    watch(imageState.styles, renderFractal);
    watchScoped(state, renderFractal, {
        ignore: opts.ignore
    });

    watch(imageState.exportConfig, (c) => console.log(c))

    return { state };
}

export default useFractal;