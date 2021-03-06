import { throwIf } from '@/utils/error';

interface RGB {
    r: number;
    g: number;
    b: number;
}

// convert any hex string to rgb object
export const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    throwIf(!result, `Invalid hex color: ${hex}`);

    return {
        r: parseInt(result![1], 16),
        g: parseInt(result![2], 16),
        b: parseInt(result![3], 16)
    };
}

// convert rgb object to hex string
export const rgbToHex = (rgb: RGB) => {
    return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}

// creates a step-based grdient function
export const createGradient = (opts: { steps: number, from: string, to: string, active: boolean }) => {
    return (step: number) => {
        if (!opts.active) return;
        if (opts.steps < step) step -= opts.steps + 1;
        const { steps, from, to } = opts;
        const stepRatio = step / steps;
        const fromRgb = hexToRgb(from);
        const toRgb = hexToRgb(to);
        const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * stepRatio);
        const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * stepRatio);
        const b = Math.round((fromRgb.b + (toRgb.b - fromRgb.b) * stepRatio));

        return rgbToHex({ r, g, b });
    }
}

// returns number between 1 and 0 while 0 is the darkest and 1 is the brightest
export const getBrightness = (hex: string): number => {
    const { r, g, b } = hexToRgb(hex);
    return (r * 299 + g * 587 + b * 114) / 1000 / 255;
}