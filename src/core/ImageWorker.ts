import type * as FRCTL from '@/types/fractal';
import { getFileName } from '@/utils/file';
import { throwIf } from '@/utils/error';
import Pen from '@/libs/Pen';

// This worker thread is responsible for generating an image in given dimensions and format.
// When done, it returns the image data as blob to the main thread

// Generates object which contains the names of all available algorithms located in src/core/algorithms
// as well as an asynchronous function which returns the exported module of each algorithm file.
// All algorithms are able to run in the context of the worker thread.
const getAlgorithms = () => {
    const algorithmImport = import.meta.glob('./algorithms/*.ts');
    return Object.entries(algorithmImport).map(([path, module]) => {
        return {
            name: getFileName(path, false),
            module
        }
    });
}

// Start image processing when SaveImageMessage is received
self.onmessage = async ({ data }: MessageEvent<FRCTL.ExportMessage<FRCTL.BaseState>>) => {
    console.log('requesting worker job');
    // offscreen canvas for image generation
    const offscreenCanvas = new OffscreenCanvas(data.dimensions[0], data.dimensions[1]);

    // search for the requested fractal algorithm module by name
    const algorithm = getAlgorithms().find(({ name }) => {
        return name.toLowerCase() === data.fractal.toLowerCase()
    })!;

    throwIf(!algorithm, `Algorithm ${data.fractal} not found`);

    // instantiate pen for drawing on offscreen canvas
    // and inherit all fractal styles from the main thread
    const pen = new Pen(offscreenCanvas)
        .setBackground(data.styles.bg)
        .setFillStyle(data.styles.fg)
        .setStrokeStyle(data.styles.fg)
        .setLineWidth(data.styles.lw);

    // load the default exported function of the algorithm module and
    // execute it using the offset canvas pen
    const drawHandler = (await algorithm.module()).default;
    drawHandler.call({}, pen, data.state);

    // convert current offscreen canvas image to blob with requested format
    const blob = await offscreenCanvas.convertToBlob({
        type: data.format,
        quality: 1
    });

    const saveMessage: FRCTL.SaveMessage = {
        fileName: `${data.fractal}.${data.format.split('/')[1]}`,
        blob
    }

    // return the generated blob to the main thread
    self.postMessage(saveMessage);
    console.log('worker job completed');
}