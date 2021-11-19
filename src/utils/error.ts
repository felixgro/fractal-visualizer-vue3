export const throwError = (msg: string) => {
    throw new Error(`[FractalVisualizer] ${msg}`);
};

export const throwIf = (condition: boolean, msg: string) => {
    if (condition) throwError(msg);
}