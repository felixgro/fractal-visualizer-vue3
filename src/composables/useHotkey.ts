import { useEventListener } from './useEventListener';

export type EventHandler = (e: KeyboardEvent) => void;

const eventHandlerList: [string[], EventHandler][] = [];
let initialized = false;

const eventHandler = (e: KeyboardEvent) => {
    const key = e.key;
    for (const [triggers, handler] of eventHandlerList) {
    }
}

export const useHotkey = (triggers: string[], handler: () => void) => {
    eventHandlerList.push([triggers, handler]);

    if (!initialized) {
        useEventListener(document, 'keydown', eventHandler);
        initialized = true;
    }
}