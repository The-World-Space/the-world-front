import { Component } from "../../engine/hierarchyObject/Component";

export class ZaxisSorter extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _offset: number = 0;
    private _runOnce: boolean = true;

    public start(): void { 
        this.update();
        if (!this._runOnce) return;
        this._gameObject.removeComponent(this);
    }

    public update(): void { 
        this._gameObject.position.z = -this._gameObject.position.y + this._offset;
    }

    get offset(): number {
        return this._offset;
    }

    set offset(value: number) {
        this._offset = value;
    }

    get runOnce(): boolean {
        return this._runOnce;
    }

    set runOnce(value: boolean) {
        this._runOnce = value;
    }
}
