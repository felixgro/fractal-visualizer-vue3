import type * as FRCTL from '@/types/fractal';
import { ref, reactive, onMounted, watch } from 'vue';
import ImageWorker from '@/core/ImageWorker?worker';
import useEventListener from '@/composables/useEventListener';
import useEmitter from '@/composables/useEmitter';
import useWorker from '@/composables/useWorker';
import { downloadBlob } from '@/utils/file';
import { watchScoped } from '@/utils/vue';
import { throwIf } from '@/utils/error';
import Pen from '@/libs/Pen';
import { useStore } from '@/stores/fractal';

// triggers re-rendering when one of those store props changes
const RENDER_TRIGGERS = ['bg', 'fg', 'lw'];

// used for defining a draw handler in each src/core/alogrithms/*.ts file.
export const defineFractal = <State>(handler: FRCTL.DrawHandler<State>) => handler;

const useFractal = <State extends FRCTL.BaseState>(opts: FRCTL.Options<State>): FRCTL.Return<State> => {
    const state = reactive<State>(opts.state);
    const renderer = ref<HTMLCanvasElement>();

    const store = useStore();
    const emitter = useEmitter();
    const imageWorker = useWorker(ImageWorker, {
        terminateAfter: 15000 // terminate worker after 15 seconds of inactivity
    });

    imageWorker.on<FRCTL.SaveMessage>(({ data: image }) => {
        if (!image.isPreview) {
            return downloadBlob(image.blob, image.fileName);
        }

        emitter.emit('fractal:previewBlob', image.blob);
    });

    const renderFractal = () => {
        throwIf(!renderer.value, 'Cannot find canvas element for rendering fractal');
        const pen = Pen.fromStyles(renderer.value!, store.styles);
        opts.drawHandler.call({}, pen, state);
    }

    const generateImage = (isPreview: boolean) => {
        const imageData: FRCTL.ExportMessage<State> = {
            fractal: 'hfractal',
            state: { ...state },
            config: { ...store.config },
            isPreview,
        };

        imageWorker.post(imageData);
    }

    onMounted(() => {
        renderer.value = document.querySelector('.fractalRenderer') as HTMLCanvasElement;
        renderFractal();
        emitter.on('fractal:save', () => generateImage(false));
        emitter.on('fractal:preview', () => generateImage(true));
    });

    store.$subscribe((mut) => {
        if (!mut.events) return;
        const evt = Array.isArray(mut.events) ? mut.events[0] : mut.events;
        if (RENDER_TRIGGERS.includes(evt.key)) renderFractal();
    });

    watchScoped(state, renderFractal, {
        ignore: opts.ignore
    });

    useEventListener(window, 'resize', renderFractal);

    return { state };
}

export default useFractal;