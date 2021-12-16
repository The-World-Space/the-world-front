import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { Transform } from "../../engine/hierarchy_object/Transform";
import { ZaxisSortable } from "./ZaxisSortable";

export class ZaxisInitializer extends ZaxisSortable {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _runOnce: boolean = true;

    protected start(): void { 
        this.process();
    }

    public update(): void { 
        if (this._runOnce) return;
        this.process();
    }

    private process(): void {
        this.gameObject.unsafeGetTransform().traverseVisible(child => { //it's safe because it's just for traversing visible children
            if (child instanceof Transform) {
                child.attachedGameObject.foreachComponent(c => {
                    const cAny = c as any;
                    if (cAny.onSortByZaxis) {
                        if (typeof cAny.onSortByZaxis === "function")
                        cAny.onSortByZaxis(this.gameObject.transform.position.z);
                    }
                });
            }
        });
    }

    public static checkAncestorZaxisInitializer(gameObject: GameObject, onSortByZaxis: (z: number) => void): void {
        if (!gameObject.transform.parent) return;
        if (gameObject.transform.parent instanceof Transform) {
            let currentAncestor = gameObject.transform.parent;
            while (currentAncestor) {
                const zaxisInitializer: ZaxisSortable|null = currentAncestor.attachedGameObject.getComponent(ZaxisSortable);
                if (zaxisInitializer) {
                    onSortByZaxis(currentAncestor.position.z);
                    return;
                }
                if (currentAncestor.parent instanceof Transform) {
                    currentAncestor = currentAncestor.parent;
                } else {
                    break;
                }
            }
        }
    }   

    get runOnce(): boolean {
        return this._runOnce;
    }

    set runOnce(value: boolean) {
        this._runOnce = value;
    }
}
