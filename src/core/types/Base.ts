
export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export enum Going {
    up = 1,
    down,
    left,
    right
}

export const goingDx = [Infinity, 0, 0, -1, 1];

export const goingDy = [Infinity, -1, 1, 0, 0];