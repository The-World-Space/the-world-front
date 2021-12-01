import { Shape } from "./Shape/Shape";
import { Point } from "./Base";

export abstract class GameObject<T extends Shape = Shape> {
    private _shape: T;
    private _position: Point;

    constructor(shape: T) {
        this._shape = shape;
        this._position = {
            x: 0, 
            y: 0
        }
    }

    setShape(shape: T) {
        this._shape = shape;
    }

    getShape() {
        return this._shape;
    }

    setPosition(pos: Point) {
        this._position = pos;
    }

    getPosition() {
        return this._position;
    }
}