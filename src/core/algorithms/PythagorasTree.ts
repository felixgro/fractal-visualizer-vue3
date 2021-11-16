import { defineFractal } from '@/core/useFractal'

export interface PyTree {
    step: number;
    scale: number;
    angleDeg: number;
    angle: number;
}

export default defineFractal<PyTree>((pen, state) => {
    console.log('hi from PythagorasTree.ts');
});