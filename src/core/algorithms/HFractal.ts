import { defineFractal } from '@/core/useFractal'
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

const random = new Prng();

export default defineFractal<HFractal>((pen, state) => {
    pen.setStrokeJoin('round').setStrokeCap('round');
    state.angle = Vec2.degToRad(state.angleDeg);
    random.seed = state.seed;

    const gradient = createGradient({
        active: state.gradient,
        steps: Math.ceil((state.step) * state.range) + 1,
        from: state.fromColor,
        to: state.toColor
    });

    // recursive h-fractal function
    const hFractal = (a: Vec2, b: Vec2, limit: number): void => {
        const currentLevel = ((state.step - limit));
        const diff = b.clone().subtract(a);

        let angle = Vec2.right().angleTo(diff);
        let branchLength = diff.length * (1 - state.trunkRatio);

        if (state.random) {
            // TODO: define random branch length and angle for each line individually
            angle +=
                random.range(1, true) *
                Vec2.degToRad(state.angleVariation);
            branchLength +=
                random.range(1, true) * state.lengthVariation;
            if (branchLength < pen.ctx.lineWidth) branchLength = pen.ctx.lineWidth;
        }

        const pA = diff.multiply(state.trunkRatio).add(a);

        const pB = Vec2.right()
            .rotate(angle + state.angle)
            .setMagnitude(branchLength)
            .add(pA);

        const pC = Vec2.right()
            .rotate(angle - state.angle)
            .setMagnitude(branchLength)
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