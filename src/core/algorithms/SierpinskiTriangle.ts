import { defineFractal } from '@/core/useFractal'

export interface SierpinskiTriangle {
    step: number;
    scale: number;
    angleDeg: number;
    angle: number;
}

export default defineFractal<SierpinskiTriangle>((pen, state) => {
    console.log('hi from SierpinskiTriangle.ts');
});