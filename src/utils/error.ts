export const throwIf = (condition: boolean, msg: string) => {
    if (condition) throw new Error(`[FractalVisualizer] ${msg}`);
}