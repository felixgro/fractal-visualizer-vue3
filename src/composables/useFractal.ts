import { ref, reactive, computed, onMounted } from 'vue';
import useEmitter from '@/composables/useEmitter';
import useScopedWatch from '@/composables/useScopedWatch';
import Pen from '@/libs/Pen';

type BaseObject = { [key: string]: any };

type DrawHandler<ConfigType> = (pen: Pen, config: ConfigType) => void;

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

// defines draw handler for fractal in seperate file.
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
        return renderer.value ? new Pen(renderer.value) : null;
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

    const saveFractal = () => console.log('save');

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