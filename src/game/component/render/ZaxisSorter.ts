import { Component } from "../../engine/hierarchyObject/Component";
import { GameObject } from "../../engine/hierarchyObject/GameObject";

export class ZaxisSorter extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _offset: number = 0;
    private _runOnce: boolean = true;

    protected start(): void { 
        this.update();
        if (!this._runOnce) return;
        this.gameObject.removeComponent(this);
    }

    public update(): void { 
        this.gameObject.position.z = -this.gameObject.position.y + this._offset;
        this.gameObject.traverseVisible(child => {
            if (child instanceof GameObject) {
                child.foreachComponent(c => {
                    if (c instanceof IZaxisSortable) {
                        c.update();
                    }
                });
            }
        });
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
