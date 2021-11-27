import type { Ref } from 'vue';
import { throwIf } from '@/utils/error';
import { onMounted, onUnmounted } from 'vue';

export type EventSubject = Ref | Window | Document;

export type EventHandler = (e: any) => void;

export type EventOptions = {
    immediate?: boolean;
}

export const useEventListener = (subject: EventSubject, event: string, handler: EventHandler, opts?: EventOptions) => {
    onMounted(() => {
        if (subject === window || subject === document) {
            subject.addEventListener(event, handler);
        } else if ((subject as Ref).value) {
            throwIf(!(subject as Ref).value, 'Cannot find element for event listening');
            (subject as Ref).value.addEventListener(event, handler);
        }
        if (opts?.immediate) handler.call({}, new Event('Initial Event Call'));
    });

    onUnmounted(() => {
        if (subject === window) {
            subject.removeEventListener(event, handler);
        } else if ((subject as Ref).value) {
            (subject as Ref).value.removeEventListener(event, handler);
        }
    });
};