import { GameObject } from "../../engine/hierarchyObject/GameObject";
import { ZaxisSortable } from "./ZaxisSortable";

export class CameraRelativeZaxisSorter extends ZaxisSortable {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _offset: number = -1000;

    public update(): void { 
        this.gameObject.position.z = this.gameManager.camera.position.z + this._offset;
        this.gameObject.traverseVisible(child => {
            if (child instanceof GameObject) {
                child.foreachComponent(c => {
                    const cAny = c as any;
                    if (cAny.onSortByZaxis) {
                        if (typeof cAny.onSortByZaxis === "function")
                        cAny.onSortByZaxis(this.gameObject.position.z);
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
}
