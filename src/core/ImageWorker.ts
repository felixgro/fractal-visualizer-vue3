import HFractal from '@/core/algorithms/HFractal';

const DEBUG_WORKER = true;

const log = (msg: string) => {
    if (DEBUG_WORKER) console.log(`[ImageWorker] ${msg}`);
}

log('spawned worker thread');

self.onmessage = (e: MessageEvent<any>) => {
    console.log(HFractal);
}