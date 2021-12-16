import { Vector3 } from "three";
import { Transform } from "../../engine/hierarchy_object/Transform";
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

    private readonly _tempVector: Vector3 = new Vector3();

    public update(): void {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        worldPosition.z = -worldPosition.y + this._offset;
        this.gameObject.transform.position.copy(this.gameObject.transform.parent!.worldToLocal(worldPosition));
        this.gameObject.unsafeGetTransform().traverseVisible(child => { //it's safe because it's just for traversing visible children
            if (child instanceof Transform) {
                child.attachedGameObject.foreachComponent(c => {
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
