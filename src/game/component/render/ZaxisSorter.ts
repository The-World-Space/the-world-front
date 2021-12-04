import { Vector3 } from "three";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { ZaxisSortable } from "./ZaxisSortable";

export class ZaxisSorter extends ZaxisSortable {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _offset: number = 0;
    private _runOnce: boolean = true;

    protected start(): void { 
        this.update();
        if (!this._runOnce) return;
        this.gameObject.removeComponent(this);
    }

    private _tempVector: Vector3 = new Vector3();

    public update(): void { 
        this._tempVector.copy(this.gameObject.position);
        const worldPosition = this.gameObject.localToWorld(this._tempVector);
        worldPosition.z = -worldPosition.y + this._offset;
        this.gameObject.position.copy(this.gameObject.worldToLocal(worldPosition));
        this.gameObject.traverseVisible(child => {
            if (child instanceof GameObject) {
                if (child.name === "onclicktest") console.log("test");
                child.foreachComponent(c => {
                    const cAny = c as any;
                    if (cAny.onSortByZaxis) {
                        if (typeof cAny.onSortByZaxis === "function")
                        cAny.onSortByZaxis(worldPosition.z);
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
