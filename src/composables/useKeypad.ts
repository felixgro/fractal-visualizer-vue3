import type { Ref } from 'vue';
import { useEventListener } from './useEventListener';
import { ref } from 'vue';

export type KeypadHandler = (num: number) => void;

export interface KeypadOpts {
    target: Ref<HTMLElement | undefined>;
    allowFloats: boolean;
    delay: number;
    handler: KeypadHandler
}

export interface KeypadReturn {
    stringNum: Ref<string>
}

const commaSymbols = ['.', ','];

export const useKeypad = (opts: KeypadOpts): KeypadReturn => {
    const stringNum = ref('');
    let tid: number | null;

    const typing = (e: KeyboardEvent) => {
        const isComma = commaSymbols.includes(e.key);
        const isNumber = !isNaN(parseFloat(e.key));

        if (!isNumber && !isComma) return;

        if (isComma) {
            stringNum.value += stringNum.value ? '.' : '0.';
        } else if (isNumber) {
            stringNum.value += e.key;
        }

        if (tid) {
            clearTimeout(tid);
            tid = null;
        }

        tid = setTimeout(() => {
            opts.handler.call({}, parseFloat(stringNum.value));
            stringNum.value = '';
        }, opts.delay);
    }

    useEventListener(opts.target, 'keydown', typing);

    return { stringNum }
}