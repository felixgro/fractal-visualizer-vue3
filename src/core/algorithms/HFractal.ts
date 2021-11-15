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

const random = new Prng();

export default defineFractal<HFractal>((pen, config) => {
    pen.setStrokeJoin('round').setStrokeCap('round');
    config.angle = Vec2.degToRad(config.angleDeg);
    random.seed = config.seed;

    const gradient = createGradient({
        active: config.gradient,
        steps: Math.ceil((config.step) * config.range) + 1,
        from: config.fromColor,
        to: config.toColor
    });

    // recursive h-fractal function
    const hFractal = (a: Vec2, b: Vec2, limit: number): void => {
        const currentLevel = ((config.step - limit));
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
        2 - (1 - pen.canvas.height * (1 - config.scale))
    );

    // start fractal recursion..
    hFractal(pA, pB, config.step);
});