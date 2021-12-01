import { GameObject } from "../../engine/hierarchyObject/GameObject";
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

    public static checkAncestorZaxisInitializer(gameObject: GameObject, onSortByZaxis: (z: number) => void): void {
        if (!gameObject.parent) return;
        if (gameObject.parent instanceof GameObject) {
            let currentAncestor: GameObject = gameObject.parent;
            while (currentAncestor) {
                const zaxisInitializer: ZaxisSortable|null = currentAncestor.getComponent(ZaxisSortable);
                if (zaxisInitializer) {
                    onSortByZaxis(currentAncestor.position.z);
                    return;
                }
                if (currentAncestor.parent instanceof GameObject) {
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
