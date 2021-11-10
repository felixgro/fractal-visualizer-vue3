import type { App } from 'vue';

export type EventStore<T> = Map<string, EventHandler<T>>;

export type EventHandler<T> = (event: T) => void;

export interface EventHandlerOptions {
    immediate?: boolean;
}

export class Emitter {
    // stores an array of event handlers for each event
    public events: Map<string, EventHandler<any>[]> = new Map();

    // register a new event handler for specified event
    // calls the handler immediately if immediate is true
    on(evt: string, handler: EventHandler<any>, options: EventHandlerOptions = {}) {
        const handlers = this.events.get(evt);
        if (handlers) {
            handlers.push(handler)
        } else {
            this.events.set(evt, [handler]);
        }

        if (options.immediate) handler.call({}, null);
    }

    // execute all handlers for an event and optionally pass data to them as arguments
    emit(evt: string, data?: any) {
        const handlers = this.events.get(evt);
        if (handlers) handlers.forEach(handler => handler.call({}, data));
    }
}

// Initialize the emitter as a plugin
export default (app: App) => {
    const emitter = new Emitter();
    app.config.globalProperties.$emitter = emitter;
}