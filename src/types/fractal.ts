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
    state: State
}

export interface Styles {
    bg: string;
    fg: string;
    lw: number;
}

export interface ExportMessage<State> {
    fractal: string,
    format: string;
    styles: Styles,
    state: State,
    dimensions: [number, number],
}

export interface SaveMessage {
    blob: Blob,
    fileName: string
}

// draw handler type for fractal drawing algorithm
export type DrawHandler<State> = (pen: Pen, state: State) => void;