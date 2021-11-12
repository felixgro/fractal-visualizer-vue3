export default () => {
    requestIdleCallbackPolyfill();
}

// request idle callback polyfill
const requestIdleCallbackPolyfill = () => {
    if (typeof window === undefined || window.requestIdleCallback) return;

    window.requestIdleCallback = (cb: any) => {
        const start = Date.now();
        return setTimeout(() => {
            cb({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
            });
        }, 1);
    };
}