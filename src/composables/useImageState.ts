import type * as FRCTL from '@/types/fractal';
import { inject } from 'vue';

// TODO: add better types
export interface ReturnImageState {
    styles: FRCTL.Styles;
    state: any;
    getters: any;
}

const useImageState = (): ReturnImageState => {
    const imageState = inject('state');
    return imageState as ReturnImageState;
}

export default useImageState;