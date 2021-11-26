import { Ref } from 'vue';
import { useEventListener } from '@/composables/useEventListener';

type RefElement = Ref<HTMLElement | undefined>;

interface ClickOutsideConfig {
    ignore?: RefElement[];
}

export const useClickOutside = (target: RefElement, handler: (e: Event) => void, config?: ClickOutsideConfig) => {
    const clickHandler = (e: Event) => {
        if (!target.value) return;
        const clickTarget = e.target as Element;

        if (config?.ignore) {
            const isIgnored = config.ignore.some(ref => ref.value === clickTarget);
            if (isIgnored) return;
        }

        if (!target.value.contains(clickTarget)) {
            handler(e);
        }
    };

    useEventListener(window, 'click', clickHandler);
}