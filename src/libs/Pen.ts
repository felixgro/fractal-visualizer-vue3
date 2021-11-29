import type * as FRCTL from '@/types/fractal';
import BasePen from 'canvas-pen';

// Pen library for abstracting canvas2d drawing operations.
// Every draw operation within each fractal's draw handler method
// is utilizing an instance of this Pen. Each method must be executable 
// within the context of a regular canvas element as well as the context of an
// offscreen canvas within a web worker. This enables the fractal to be redrawn
// within the ImageWorker when exporting a fractal as an image.
// canvas-pen: https://github.com/felixgro/canvas-pen
export default class Pen extends BasePen {
    // This class acts as a proxy to the canvas-pen library.
    // It may be extendend in the future to allow for more complex drawing operations

    public static fromStyles(canvas: HTMLCanvasElement | OffscreenCanvas, styles: FRCTL.Styles): Pen {
        return new Pen(canvas)
            .clear()
            .setBackground(styles.bg)
            .setFillStyle(styles.fg)
            .setStrokeStyle(styles.fg)
            .setStrokeWidth(styles.lw);
    }

    // Line width must be relative to canvas width to maintain consistency
    // when exporting current fractal as an image with varying dimensions.
    public setStrokeWidth(relWidth: number): this {
        this.ctx.lineWidth = this.canvas.width * (relWidth / 100);
        return this;
    }

    public rotate(radians: number): this {
        this.ctx.rotate(radians);
        return this;
    }
}