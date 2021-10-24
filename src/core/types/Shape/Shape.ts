import { Point, Size } from "../Base";

export abstract class Shape {
    _size!: Size;

    constructor(size: Size) {
        this.setSize(size);
    }

    getSize() {
        return this._size;
    }

    setSize(size: Size) {
        this._size = size;
    }
}