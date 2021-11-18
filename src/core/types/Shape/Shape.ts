import { Point, Size } from "../Base";

export abstract class Shape {
    private _size!: Size;

    constructor(size: Size) {
        this._size = size;
    }

    getSize() {
        return this._size;
    }

    setSize(size: Size) {
        this._size = size;
    }
}