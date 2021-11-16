import type * as FRCTL from '@/types/fractal';
import { ref, reactive, computed, onMounted } from 'vue';
import ImageWorker from '@/core/ImageWorker?worker';
import useEmitter from '@/composables/useEmitter';
import useWorker from '@/composables/useWorker';
import { downloadBlob } from '@/utils/file';
import { watchScoped } from '@/utils/vue';
import Pen from '@/libs/Pen';

// used for defining a draw handler in each src/core/alogrithms/*.ts file.
export const defineFractal = <State>(handler: FRCTL.DrawHandler<State>) => handler;

const useFractal = <State extends FRCTL.BaseState>(opts: FRCTL.Options<State>): FRCTL.Return<State> => {
    const state = reactive<State>(opts.state);
    const styles = reactive<FRCTL.Styles>({
        bg: '#ffffff',
        fg: '#000000',
        lw: .5
    });

    const renderer = ref<HTMLCanvasElement>();
    const pen = computed<Pen | null>(() => {
        return renderer.value ? new Pen(renderer.value) : null;
    });

    const emitter = useEmitter();
    const imageWorker = useWorker(ImageWorker, {
        terminateAfter: 15000 // terminate worker after 15 seconds of inactivity
    });

    imageWorker.on<FRCTL.SaveMessage>(({ data: image }) => {
        downloadBlob(image.blob, image.fileName);
    });

    const renderFractal = () => {
        if (!renderer.value || !pen.value)
            throw new Error(`Cannot find canvas element or it's rendering context`);

        pen.value.clear()
            .setBackground(styles.bg)
            .setFillStyle(styles.fg)
            .setStrokeStyle(styles.fg)
            .setLineWidth(styles.lw);

        opts.drawHandler.call({}, pen.value, state);
    }

    const styleFractal = (s: FRCTL.Styles) => {
        styles.bg = s.bg;
        styles.fg = s.fg;
        styles.lw = s.lw;
    }

    const saveFractal = () => {
        const imageData: FRCTL.ExportMessage<State> = {
            fractal: 'hfractal',
            state: { ...state },
            styles: { ...styles },
            dimensions: [3000, 3000],
            format: 'image/png',
        };

        imageWorker.post(imageData);
    };

    onMounted(() => {
        renderer.value = document.querySelector('.fractalRenderer') as HTMLCanvasElement;

        emitter.on('fractal:save', saveFractal);
        emitter.on('fractal:style', styleFractal);
        emitter.on('fractal:render', renderFractal, {
            immediate: true
        });
    });

    watchScoped(state, renderFractal, {
        ignore: opts.ignore
    });

    return { state };
}

export default useFractal;