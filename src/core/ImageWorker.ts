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

self.onmessage = async ({ data }: MessageEvent<FRCTL.ExportMessage>) => {
    try {
        const offscreenCanvas = new OffscreenCanvas(data.export.width, data.export.height);
        const algorithm = getAlgorithms().find(({ name }) => {
            return name.toLowerCase() === data.fractal.toLowerCase()
        })!;
        throwIf(!algorithm, `Cannot find algorithm for '${data.fractal}'`);

        const drawHandler = (await algorithm.module()).default;
        const pen = Pen.fromStyles(offscreenCanvas, data.styles);

        drawHandler.call({}, pen, data.state);

        const blob = await offscreenCanvas.convertToBlob({
            type: data.export.format,
            quality: 1
        });

        const saveMessage: FRCTL.SaveMessage = {
            blob,
            error: null,
        }

        self.postMessage(saveMessage);
        console.log('worker idling');
    } catch (error) {
        // native error handlers doesn't work when using async/await in the worker thread
        // so we need to handle the error manually by passing it to the main thread.
        self.postMessage({ error });
    }
}