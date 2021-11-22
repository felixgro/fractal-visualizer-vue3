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
    const offscreenCanvas = new OffscreenCanvas(data.config.width, data.config.height);
    const algorithm = getAlgorithms().find(({ name }) => {
        return name.toLowerCase() === data.fractal.toLowerCase()
    })!;
    throwIf(!algorithm, `Cannot find algorithm for '${data.fractal}'`);


    const pen = Pen.fromStyles(offscreenCanvas, { lw: data.config.lw, bg: data.config.bg, fg: data.config.fg });
    const drawHandler = (await algorithm.module()).default;
    drawHandler.call({}, pen, data.state);

    const blob = await offscreenCanvas.convertToBlob({
        type: data.config.format,
        quality: 1
    });

    const saveMessage: FRCTL.SaveMessage = {
        fileName: `${data.fractal}.${data.config.format.split('/')[1]}`,
        isPreview: data.isPreview,
        blob
    }

    // return the generated blob to the main thread
    self.postMessage(saveMessage);
    console.log('worker job completed');
    console.log('worker idling');
}