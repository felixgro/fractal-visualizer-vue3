import { ref, onUnmounted } from 'vue';

const defaultTerminateAfter = 10000; // automatically terminate after 10 seconds

export interface UseWorkerOptions {
    terminateAfter?: number;
}

export const useWorker = (WorkerClass: new () => Worker, opts?: UseWorkerOptions) => {
    const worker = ref<Worker | null>(null);
    const timeoutId = ref<number>();

    const handler = ref<(this: Worker, msg: MessageEvent<any>) => void>();

    const setTerminateTimeout = () => {
        if (timeoutId.value) clearTimeout(timeoutId.value);

        timeoutId.value = setTimeout(() => {
            terminate();
        }, opts?.terminateAfter ?? defaultTerminateAfter);
    }

    const terminate = () => {
        if (!worker.value) return;
        if (timeoutId.value) {
            clearTimeout(timeoutId.value)
            timeoutId.value = 0;
        };

        console.log('terminating worker');
        worker.value.terminate();
        worker.value = null;
    }

    const spawn = () => {
        if (worker.value) return;

        console.log('spawning worker');
        worker.value = new WorkerClass();

        if (handler.value) worker.value.onmessage = handler.value;
        setTerminateTimeout();
    }

    const post = (msg: any) => {
        if (!worker.value) spawn();

        worker.value!.postMessage(msg);
        setTerminateTimeout();
    }

    const on = <Data>(cb: (msg: MessageEvent<Data>) => void) => {
        handler.value = cb;
    }

    const isRunning = () => worker.value !== null;

    onUnmounted(terminate);

    return {
        on,
        post,
        spawn,
        isRunning,
        terminate,
    };
}