export const useHeightTransition = () => {
    const enter = (element: Element, done: () => void) => {
        const el = element as HTMLElement;
        const width = getComputedStyle(el).width;

        el.style.width = width;
        el.style.position = 'absolute';
        el.style.visibility = 'hidden';
        el.style.height = 'auto';

        const height = getComputedStyle(el).height;

        el.style.width = '';
        el.style.position = '';
        el.style.visibility = '';
        el.style.height = '0';

        // Force repaint to make sure the
        // animation is triggered correctly.
        getComputedStyle(el).height;

        // Trigger the animation.
        // We use `requestAnimationFrame` because we need
        // to make sure the browser has finished
        // painting after setting the `height`
        // to `0` in the line above.
        requestAnimationFrame(() => {
            el.style.height = height;
        });
    };

    const afterEnter = (element: Element) => {
        const el = element as HTMLElement;
        el.style.height = 'auto';
    };

    const leave = (element: Element, done: () => void) => {
        const el = element as HTMLElement;
        const height = getComputedStyle(el).height;

        el.style.height = height;

        // Force repaint to make sure the
        getComputedStyle(el).height;

        requestAnimationFrame(() => {
            el.style.height = '0';
        });
    };

    return { enter, afterEnter, leave };
};