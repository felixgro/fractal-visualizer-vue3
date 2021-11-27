import type * as FRCTL from '@/types/fractal';
import * as Algorithms from '@/core/algorithms';
import { throwIf } from '@/utils/error';
import Pen from '@/libs/Pen';

self.onmessage = ({ data }: MessageEvent<FRCTL.ExportMessage>) => {
    try {
        const offscreenCanvas = new OffscreenCanvas(data.export.width, data.export.height);
        const algorithm = Object.entries(Algorithms).find(([name]) => {
            return name.toLowerCase() === data.fractal.toLowerCase();
        });

        throwIf(!algorithm, `Cannot find algorithm for '${data.fractal}'`);

        const pen = Pen.fromStyles(offscreenCanvas, data.styles);

        algorithm![1].call({}, pen, data.state as any);

        offscreenCanvas.convertToBlob({
            type: data.export.format,
            quality: 1
        }).then((blob) => {
            const saveMessage: FRCTL.SaveMessage = {
                blob,
                error: null,
            }

            self.postMessage(saveMessage);
            console.log('worker idling');
        });
    } catch (error) {
        // TODO: Better error handling
        // native error handlers doesn't work when using async/await in the worker thread
        // so we need to handle the error manually by passing it to the main thread.
        self.postMessage({ error });
    }
}