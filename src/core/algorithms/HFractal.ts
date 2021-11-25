import { defineFractal } from '@/composables/useFractal'
import { createGradient } from '@/utils/color';
import Prng from '@/libs/Prng';
import Vec2 from '@/libs/Vec2';

export interface HFractal {
    step: number;
    scale: number;
    angleDeg: number;
    angle: number;
    trunkRatio: number;
    random: boolean;
    seed: number;
    angleVariation: number;
    lengthVariation: number;
    gradient: boolean;
    range: number;
    fromColor: string;
    toColor: string;
}


export default defineFractal<HFractal>((pen, state) => {
    const random = new Prng(state.seed, state.random);

    const gradient = createGradient({
        active: state.gradient,
        steps: Math.ceil((state.step) * state.range) + 1,
        from: state.fromColor,
        to: state.toColor
    });

    pen.setStrokeJoin('round').setStrokeCap('round');
    state.angle = Vec2.degToRad(state.angleDeg);

    // recursive h-fractal function
    const hFractal = (a: Vec2, b: Vec2, limit: number): void => {
        const currentLevel = ((state.step - limit));
        const diff = b.clone().subtract(a);
        const baseAngle = Vec2.right().angleTo(diff);
        const baseMag = diff.length * (1 - state.trunkRatio);

        const angleA = baseAngle + state.angle + state.angle * random.range(Vec2.degToRad(state.angleVariation), true);
        const angleB = baseAngle - state.angle + state.angle * random.range(Vec2.degToRad(state.angleVariation), true);
        const magA = baseMag + baseMag * random.range(state.lengthVariation, true);
        const magB = baseMag + baseMag * random.range(state.lengthVariation, true);

        const pA = diff.multiply(state.trunkRatio).add(a);

        const pB = Vec2.right()
            .rotate(angleA)
            .setMagnitude(magA)
            .add(pA);

        const pC = Vec2.right()
            .rotate(angleB)
            .setMagnitude(magB)
            .add(pA);

        pen.line(a.pos, pA.pos).stroke(gradient(currentLevel));

        // recursion limit
        if (limit > 0) {
            hFractal(pA, pC, limit - 1);
            hFractal(pA, pB, limit - 1);
        } else {
            // draw splitted branch and stop recursion
            pen.line(pB.pos, pA.pos, pC.pos).stroke(gradient(currentLevel + 1));
        }
    };

    // initial points for first iteration
    const pA = new Vec2(pen.canvas.width / 2, pen.canvas.height);
    const pB = new Vec2(
        pen.canvas.width / 2,
        2 - (1 - pen.canvas.height * (1 - state.scale))
    );

    // start fractal recursion..
    hFractal(pA, pB, state.step);
});