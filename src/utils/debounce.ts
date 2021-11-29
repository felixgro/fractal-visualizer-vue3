type DefaultFunction = (...args: any[]) => any;

export const debounce = (fn: DefaultFunction, options?: {
    timeout?: number
    leading?: boolean;
    trailing?: boolean;
}): DefaultFunction => {
    let timeoutId: number | null;
    const config = Object.assign({}, {
        timeout: 120,
        leading: true,
        trailing: false
    }, options);

    return function (this: any, ...args) {
        let isInvoked = false;

        if (!timeoutId && config.leading) {
            fn.call(this, ...args);
            isInvoked = true;
        }

        if (timeoutId) window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(() => {
            if (config.trailing && !isInvoked) {
                fn.call(this, ...args);
            }

            timeoutId = null;
        }, config.timeout);
    }
}