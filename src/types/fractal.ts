import type Pen from '@/libs/Pen';

export type BaseState = { [key: string]: any };

// composable argument type: useFractal<State>(opts: Options<State>)
export interface Options<State> {
    state: State,
    ignore?: (keyof State)[];
    drawHandler: DrawHandler<State>
}

// useFractal composable return type
export interface Return<State> {
    state: any
}

export interface Styles {
    bg: string;
    fg: string;
    lw: number;
}

export interface ExportConfig {
    width: number;
    height: number;
    format: string;
}

export interface ExportMessage {
    fractal: string,
    state: BaseState,
    export: ExportConfig,
    styles: Styles,
}

export interface SaveMessage {
    blob: Blob,
    error: any,
}

export interface UseImageState {
    styles: Styles;
    exportConfig: ExportConfig;
    getters: { [key: string]: () => any };
}

// draw handler type for fractal drawing algorithm
export type DrawHandler<State> = (pen: Pen, state: State) => void;