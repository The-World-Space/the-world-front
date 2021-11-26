import { IReadonlyTime } from "./component/IReadonlyTime";

export class Time implements IReadonlyTime {
    private _deltaTime: number;

    public constructor() {
        this._deltaTime = 0;
    }

    public get deltaTime(): number {
        return this._deltaTime;
    }

    public set deltaTime(value: number) {
        this._deltaTime = value;
    }
}