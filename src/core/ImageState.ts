import * as FRCTL from '@/types/fractal';
import { reactive } from 'vue';

const state = reactive({
    width: 4000,
    height: 4000,
    format: 'image/png'
});

const styles = reactive<FRCTL.Styles>({
    bg: '#ffffff',
    fg: '#000000',
    lw: .5,
});

const getters = {
    dimensions: () => [state.width, state.height],
    format: () => state.format,
}

export default {
    styles,
    state,
    getters
};