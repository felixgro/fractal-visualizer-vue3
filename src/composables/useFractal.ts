import { ref, reactive, computed, onMounted } from 'vue';
import ImageWorker from '@/core/ImageWorker?worker';
import useEmitter from '@/composables/useEmitter';
import useScopedWatch from '@/composables/useScopedWatch';
import Pen from '@/libs/Pen';
import { downloadBlob } from '@/utils/file';

type BaseObject = { [key: string]: any };

type DrawHandler<ConfigType> = (pen: Pen, config: ConfigType, utils?: any) => void;

export interface FractalOptions<ConfigType> {
    config: ConfigType,
    ignore?: (keyof ConfigType)[];
    drawHandler: DrawHandler<ConfigType>
}

export interface FractalStyles {
    bg: string;
    fg: string;
    lw: number;
}

export interface FractalReturn<ConfigType> {
    config: ConfigType
}

export interface SaveImageMessage {
    fractal: string,
    format: string;
    styles: FractalStyles,
    dimensions: [number, number],
    state: { [key: string]: any },
}


// used for type hints when defining a draw handler in seperate file.
export const defineFractal = <ConfigType>(handler: DrawHandler<ConfigType>) => handler;

const useFractal = <FC extends BaseObject>(opts: FractalOptions<FC>): FractalReturn<FC> => {
    // reactive objects for storing current fractal state
    const config = reactive<FC>(opts.config);
    const styles = reactive<FractalStyles>({
        bg: '#ffffff',
        fg: '#000000',
        lw: 3
    });

    // used to listen for style change or rerender events
    const emitter = useEmitter();

    // store canvas element and it's rendering context
    const renderer = ref<HTMLCanvasElement>();
    const pen = computed<Pen | null>(() => {
        return renderer.value ? new Pen(renderer.value.getContext('2d')!) : null;
    });

    const renderFractal = () => {
        if (!renderer.value || !pen.value)
            throw new Error(`Cannot find canvas element or it's rendering context`);

        pen.value.clear()
            .setBackground(styles.bg)
            .setFillStyle(styles.fg)
            .setStrokeStyle(styles.fg)
            .setLineWidth(styles.lw);

        opts.drawHandler.call({}, pen.value, config);
    }

    const styleFractal = (s: FractalStyles) => {
        styles.bg = s.bg;
        styles.fg = s.fg;
        styles.lw = s.lw;
    }

    const saveFractal = () => {
        const imageData: SaveImageMessage = {
            fractal: 'hfractal',
            styles: { ...styles },
            state: { ...config },
            dimensions: [3000, 3000],
            format: 'webp',
        };

        const worker = new ImageWorker();

        worker.onmessage = (e: MessageEvent<Blob>) => {
            downloadBlob(e.data, 'fractal.png');
            worker.terminate();
        };

        worker.postMessage(imageData);
    };

    onMounted(() => {
        renderer.value = document.querySelector('.fractalRenderer') as HTMLCanvasElement;

        emitter.on('fractal:save', saveFractal);
        emitter.on('fractal:style', styleFractal);
        emitter.on('fractal:render', renderFractal, {
            immediate: true
        });
    });

    useScopedWatch(config, renderFractal, {
        ignore: opts.ignore
    });

    return { config };
}

export default useFractal;