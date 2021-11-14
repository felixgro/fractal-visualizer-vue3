interface RGB {
    r: number;
    g: number;
    b: number;
}

export const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) throw new Error(`Cannot convert hex '${hex}' to rgb`);

    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
}

export const rgbToHex = (rgb: RGB) => {
    return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}

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