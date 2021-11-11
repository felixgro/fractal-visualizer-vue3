import HFractal from '@/core/algorithms/HFractal';
import Pen from '@/libs/Pen';
import { SaveImageMessage } from '@/composables/useFractal';


// this worker thread is responsible for generating an image in given size and format
// when done, it returns the image data as blob to the main thread
self.onmessage = async ({ data }: MessageEvent<SaveImageMessage>) => {
    // create offscreen canvas & get it's rendering context for image generation
    const canvas = new OffscreenCanvas(data.dimensions[0], data.dimensions[1]);
    const ctx = canvas.getContext('2d')!;

    // inherit the pen's styles from the main thread
    const pen = new Pen(ctx)
        .setBackground(data.styles.bg)
        .setFillStyle(data.styles.fg)
        .setStrokeStyle(data.styles.fg)
        .setLineWidth(data.styles.lw);

    // calls specified draw handler with given state as config and
    // a pen, which draws on the offscreen canvas.
    // TODO: dynamically load the algorithm based of data.fractal
    (HFractal as any).call({}, pen, data.state);

    // get the image data from the offscreen canvas and convert it to blob type
    // FIXME: only works with png, not jpeg or web
    const imageBlob = await canvas.convertToBlob({
        type: `image/${data.format}`,
        quality: 1
    });

    console.log('done');

    // return the generated blob to the main thread
    self.postMessage(imageBlob);
}