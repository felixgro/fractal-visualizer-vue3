import { ref, reactive, onMounted, watch } from 'vue';
import useEmitter from '@/composables/useEmitter';
import Pen from '@/libs/Pen';

export interface RenderOptions<ConfigType> {
    ignore?: (keyof ConfigType)[];
}

export interface FractalStyles {
    bg: string,
    fg: string,
    lw: number
}

export interface Fractal<ConfigType> {
    config: ConfigType,
    draw: (fn: DrawHandler) => void
}

export type DrawHandler = (pen: Pen) => void;

const useFractal = <FC extends { [key: string]: any }>(data: FC, opts: RenderOptions<FC> = {}): Fractal<FC> => {
    // reactive objects for storing current fractal state
    const config = reactive(data);
    const styles = reactive<FractalStyles>({
        bg: '#fff',
        fg: '#000',
        lw: 3
    });

    // stores canvas element as well as it's rendering context
    const renderer = ref<HTMLCanvasElement>();
    const ctx = ref<CanvasRenderingContext2D>();

    // stores drawing logic for current fractal
    const drawHandler = ref<DrawHandler>();

    // used to store the draw logic as a callback in each fractal component
    const draw = (fn: DrawHandler) => drawHandler.value = fn;

    // used to listen for style change or rerender events
    const emitter = useEmitter();

    // renders current fractal state on canvas
    const renderFractal = (): void => {
        if (!renderer.value || !ctx.value)
            throw new Error("Cannot find canvas element or it's rendering context");

        const pen = new Pen(ctx.value)
            .clear()
            .setBackground(styles.bg)
            .setStrokeStyle(styles.fg)
            .setFillStyle(styles.fg)
            .setLineWidth(styles.lw);

        drawHandler.value?.call({}, pen);
    }

    // TODO: Save Fractal in specified dimensions using a web worker
    const saveFractal = (): void => {
        console.log('save');
    }

    // generate array for watched config keys and exclude
    // ignored keys when specified in render options
    const watchedKeys: (() => keyof FC)[] = [];
    for (const key in config) {
        if (opts?.ignore && opts.ignore.indexOf(key) >= 0) continue;
        watchedKeys.push(() => config[key]);
    }

    // watch for changes in config object and rerender fractal if changed
    watch(watchedKeys, renderFractal);

    // initialize renderer and context along with event listeners
    // when component has finished mounting
    onMounted(() => {
        renderer.value = document.querySelector('.fractalRenderer') as HTMLCanvasElement;
        ctx.value = renderer.value.getContext('2d')!;

        emitter.on('fractal.render', renderFractal, {
            immediate: true
        });

        emitter.on('fractal.save', saveFractal);

        emitter.on('fractal.style', (s: FractalStyles) => {
            styles.bg = s.bg;
            styles.fg = s.fg;
            styles.lw = s.lw;
        });
    });

    return { config, draw }
}

export default useFractal