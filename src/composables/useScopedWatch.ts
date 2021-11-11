import { watch, WatchCallback } from 'vue';

type GenericObject = { [key: string]: any };

export interface ScopedWatchOptions<T> {
    ignore?: (keyof T)[];
}

const useScopedWatch = <T extends GenericObject>(data: T, watchEffect: WatchCallback, opts?: ScopedWatchOptions<T>) => {
    // generate array for watched config keys and exclude
    // ignored keys when specified in opts.ignore
    const watchedKeys: (() => keyof T)[] = [];

    for (const key in data) {
        if (opts?.ignore && opts.ignore.indexOf(key) >= 0) continue;
        watchedKeys.push(() => data[key]);
    }

    watch(watchedKeys, watchEffect);
}

export default useScopedWatch;