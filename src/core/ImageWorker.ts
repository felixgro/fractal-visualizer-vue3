import type * as FRCTL from '@/types/fractal';
import * as Algorithms from '@/core/algorithms';
import { throwIf } from '@/utils/error';
import Pen from '@/libs/Pen';

self.onmessage = async ({ data }: MessageEvent<FRCTL.ExportMessage>) => {
    try {
        const fractalAlgorithm = Object.entries(Algorithms).find(([name]) => {
            return name.toLowerCase() === data.fractal.toLowerCase();
        });
        throwIf(!fractalAlgorithm || !fractalAlgorithm[1], `Cannot find algorithm for '${data.fractal}'`);

        const offscreenCanvas = new OffscreenCanvas(data.export.width, data.export.height);
        const pen = Pen.fromStyles(offscreenCanvas, data.styles);

        fractalAlgorithm![1](pen, data.state as any);

        const blob = await offscreenCanvas.convertToBlob({
            type: data.export.format,
            quality: 1
        })

        const saveMessage: FRCTL.SaveMessage = {
            blob,
            error: null,
        }

        self.postMessage(saveMessage);
        console.log('worker idling');
    } catch (error) {
        // TODO: Better error handling
        // native error handlers doesn't work when using async/await in the worker thread
        // so we need to handle the error manually by passing it to the main thread.
        self.postMessage({ error });
    }
}