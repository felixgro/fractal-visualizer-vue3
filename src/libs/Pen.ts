import BasePen from 'canvas-pen';

export default class Pen extends BasePen {

    // set background color of canvas
    public setBackground(color: string): this {
        const center: [number, number] = [this.canvas.width / 2, this.canvas.height / 2];

        return this.save()
            .setFillStyle(color)
            .rect(center, this.canvas.width, this.canvas.height)
            .fill()
            .restore();
    }
}