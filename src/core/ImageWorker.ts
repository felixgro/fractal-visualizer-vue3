import type * as FRCTL from '@/types/fractal';
import { getFileName } from '@/utils/file';
import { throwIf } from '@/utils/error';
import Pen from '@/libs/Pen';

// Generates object which contains the names of all available algorithms located in src/core/algorithms
// as well as an asynchronous function which returns the exported module of each algorithm file.
// All algorithms should be able to run in the context of the worker thread.
const getAlgorithms = () => {
    const algorithmImport = import.meta.glob('./algorithms/*.ts');
    return Object.entries(algorithmImport).map(([path, module]) => {
        return {
            name: getFileName(path, false),
            module
        }
    });
}

self.onmessage = async ({ data }: MessageEvent<FRCTL.ExportMessage<FRCTL.BaseState>>) => {
    console.log('requesting worker job');
    const offscreenCanvas = new OffscreenCanvas(data.dimensions[0], data.dimensions[1]);

    const algorithm = getAlgorithms().find(({ name }) => {
        return name.toLowerCase() === data.fractal.toLowerCase()
    })!;
    throwIf(!algorithm, `Cannot find algorithm for '${data.fractal}'`);


    const pen = Pen.fromStyles(offscreenCanvas, data.styles);
    const drawHandler = (await algorithm.module()).default;
    drawHandler.call({}, pen, data.state);

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
    console.log('worker idling');
}