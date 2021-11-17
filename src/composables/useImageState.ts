import type * as FRCTL from '@/types/fractal';
import { inject } from 'vue';

const useImageState = (): FRCTL.UseImageState => {
    const imageState = inject<FRCTL.UseImageState>('state');
    if (!imageState) throw new Error('Cannot find current ImageState');
    return imageState;
}

export default useImageState;