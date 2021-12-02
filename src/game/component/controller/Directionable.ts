import { Component } from "../../engine/hierarchy_object/Component";

export enum Direction {
    Up,
    Down,
    Left,
    Right,
    None
}

export class Directionable extends Component {
    private _direction: Direction = Direction.None;

    public get direction(): Direction {
        return this._direction;
    }

    protected set direction(direction: Direction) {
        this._direction = direction;
    }
}
