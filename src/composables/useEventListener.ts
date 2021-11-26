import type { Ref } from 'vue';
import { onMounted, onUnmounted } from 'vue';

export type EventSubject = Ref | Window;

export type EventHandler = (e: Event) => void;

export type EventOptions = {
    immediate?: boolean;
}

export const useEventListener = (subject: EventSubject, event: string, handler: EventHandler, opts?: EventOptions) => {
    onMounted(() => {
        if (subject === window) {
            subject.addEventListener(event, handler);
        } else if ((subject as Ref).value) {
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