import { Color } from "./Color";

export class CameraInfo {
    private _priority: number;
    private _backgroundColor: Color;

    public constructor(
        priority: number,
        backgroundColor: Color
    ) {
        this._priority = priority;
        this._backgroundColor = backgroundColor;
    }

    public get priority(): number {
        return this._priority;
    }

    public set priority(value: number) {
        this._priority = value;
    }

    public get backgroundColor(): Color {
        return this._backgroundColor;
    }

    public set backgroundColor(value: Color) {
        this._backgroundColor = value;
    }
}
