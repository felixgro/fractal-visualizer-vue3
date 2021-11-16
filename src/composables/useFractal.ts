import type * as FRCTL from '@/types/fractal';
import { ref, reactive, onMounted } from 'vue';
import ImageWorker from '@/core/ImageWorker?worker';
import { downloadBlob } from '@/utils/file';
import { watchScoped } from '@/utils/vue';
import useEmitter from '@/composables/useEmitter';
import useWorker from '@/composables/useWorker';
import Pen from '@/libs/Pen';

// used for defining a draw handler in each src/core/alogrithms/*.ts file.
export const defineFractal = <State>(handler: FRCTL.DrawHandler<State>) => handler;

const useFractal = <State extends FRCTL.BaseState>(opts: FRCTL.Options<State>): FRCTL.Return<State> => {
    const state = reactive<State>(opts.state);
    const renderer = ref<HTMLCanvasElement>();

    // TODO: store in global state along with image type and dimensions for export
    const styles = reactive<FRCTL.Styles>({
        bg: '#ffffff',
        fg: '#000000',
        lw: .5
    });

    const emitter = useEmitter();
    const imageWorker = useWorker(ImageWorker, {
        terminateAfter: 15000 // terminate worker after 15 seconds of inactivity
    });

    imageWorker.on<FRCTL.SaveMessage>(({ data: image }) => {
        downloadBlob(image.blob, image.fileName);
    });

    const renderFractal = () => {
        if (!renderer.value) throw new Error(`Cannot find canvas element for rendering fractal`);

        const pen = new Pen(renderer.value)
            .clear()
            .setBackground(styles.bg)
            .setStrokeStyle(styles.fg)
            .setFillStyle(styles.fg)
            .setLineWidth(styles.lw);

        opts.drawHandler.call({}, pen, state);
    }

    // TODO: replace this by reactive store
    const styleFractal = (s: FRCTL.Styles) => {
        styles.bg = s.bg;
        styles.fg = s.fg;
        styles.lw = s.lw;

        renderFractal();
    }

    const saveFractal = () => {
        // TODO: check for browser support
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

        renderFractal();

        emitter.on('fractal:save', saveFractal);
        emitter.on('fractal:style', styleFractal);
    });

    watchScoped(state, renderFractal, {
        ignore: opts.ignore
    });

    return { state };
}

export default useFractal;