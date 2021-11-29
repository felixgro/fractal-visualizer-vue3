import { defineFractal } from '@/composables/useFractal'
import Vec2 from '@/libs/Vec2';

export interface PyTree {
    step: number;
    scale: number;
    angleDeg: number;
    angle: number;
}

interface Branch {
    vec: Vec2,
    size: number,
    angle: number
}

export default defineFractal<PyTree>((pen, state) => {
    const angle = Vec2.degToRad(-state.angleDeg);

    const drawBranch = (branch: Branch) => {
        pen.save()
            .translate(branch.vec.pos)
            .rotate(branch.angle)
            .rect([0, 0], branch.size, -branch.size).fill().restore();
    }

    const pyTree = (branch: Branch, limit: number) => {
        pen.save()
            .translate(branch.vec.pos)
            .rotate(branch.angle)
            .rect([0, 0], branch.size, -branch.size)
            .fill();

        const leftBranch: Branch = {
            vec: new Vec2(0, -branch.size),
            size: Math.abs(Math.cos(angle) * branch.size),
            angle
        }

        const rightBranch: Branch = {
            vec: new Vec2(leftBranch.vec.x + Math.cos(leftBranch.angle) * leftBranch.size, leftBranch.vec.y + Math.sin(leftBranch.angle) * leftBranch.size),
            size: Math.abs(Math.sin(angle) * branch.size),
            angle: leftBranch.angle + Math.PI / 2
        }

        // recusion logic
        if (limit > 0) {
            pyTree(leftBranch, limit - 1);
            pyTree(rightBranch, limit - 1);
        } else {
            drawBranch(leftBranch);
            drawBranch(rightBranch);
        }
        pen.restore();
    }

    const size = 200 * state.scale;


    pyTree({
        vec: new Vec2(pen.canvas.width / 2 - size / 2, pen.canvas.height),
        size,
        angle: 0
    }, state.step);
});