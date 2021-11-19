import * as FRCTL from '@/types/fractal';
import { reactive } from 'vue';

const exportConfig = reactive<FRCTL.ExportConfig>({
    width: 2000,
    height: 2000,
    format: 'image/png'
});

const styles = reactive<FRCTL.Styles>({
    bg: '#ffffff',
    fg: '#000000',
    lw: .3,
});

const getters = {
    dimensions: () => [exportConfig.width, exportConfig.height],
    styles: () => { return { ...styles } },
    format: () => exportConfig.format,
}

export default {
    styles,
    exportConfig,
    getters
};