import { defineFractal } from '@/composables/useFractal'
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
}

const random = new Prng();

export default defineFractal<HFractal>((pen, config) => {
    // assigns current seed to pseudo random number generator
    // & resets the prng even if the seed value has not changed.
    config.angle = Vec2.degToRad(config.angleDeg);
    random.seed = config.seed;

    // recursive fractal function
    const hFractal = (a: Vec2, b: Vec2, limit: number): void => {
        const diff = b.clone().subtract(a);

        let angle = Vec2.right().angleTo(diff);
        let branchLength = diff.length * (1 - config.trunkRatio);

        if (config.random) {
            angle +=
                random.range(1, true) *
                Vec2.degToRad(config.angleVariation);
            branchLength +=
                random.range(1, true) * config.lengthVariation;
            if (branchLength <= 0) branchLength = 0.000001;
        }

        const pA = diff.multiply(config.trunkRatio).add(a);

        const pB = Vec2.right()
            .rotate(angle + config.angle)
            .setMagnitude(branchLength)
            .add(pA);

        const pC = Vec2.right()
            .rotate(angle - config.angle)
            .setMagnitude(branchLength)
            .add(pA);

        // draw base branch
        pen.line(a.pos, pA.pos).stroke();

        // recursion limit
        if (limit > 0) {
            hFractal(pA, pC, limit - 1);
            hFractal(pA, pB, limit - 1);
        } else {
            // draw splitted branch and stop recursion
            pen.line(pB.pos, pA.pos, pC.pos).stroke();
        }
    };

    // initial points for first iteration
    const pA = new Vec2(pen.canvas.width / 2, pen.canvas.height);
    const pB = new Vec2(
        pen.canvas.width / 2,
        2 - (1 - pen.canvas.height * (1 - config.scale))
    );

    // start fractal recursion..
    hFractal(pA, pB, config.step);
});