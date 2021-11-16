import type { WatchCallback } from 'vue';
import { watch } from 'vue';

export interface ScopedWatchOptions<T> {
    ignore?: (keyof T)[];
}

// generate array for watched config keys and exclude ignored keys when specified in opts.ignore
export const watchScoped = <T extends { [key: string]: any }>(data: T, watchEffect: WatchCallback, opts?: ScopedWatchOptions<T>) => {
    const watchedKeys: (() => keyof T)[] = [];

    for (const key in data) {
        if (opts?.ignore && opts.ignore.indexOf(key) >= 0) continue;
        watchedKeys.push(() => data[key]);
    }

    watch(watchedKeys, watchEffect);
}