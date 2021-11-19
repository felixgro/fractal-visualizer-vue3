import type * as FRCTL from '@/types/fractal';
import { throwIf } from '@/utils/error';
import { inject } from 'vue';

const useImageState = (): FRCTL.UseImageState => {
    const imageState = inject<FRCTL.UseImageState>('state');
    throwIf(!imageState, 'useImageState: no image state found');
    return imageState!;
}

export default useImageState;