import { Vector3 } from "three";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
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

    private readonly _tempVector3 = new Vector3();

    private process(): void {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);

        this.gameObject.getComponentsInChildren().forEach(component => {
            const cAny = component as any;
            if (cAny.onSortByZaxis) {
                if (typeof cAny.onSortByZaxis === "function") {
                    cAny.onSortByZaxis(worldPosition.z);
                }
            }
        });
    }

    public static checkAncestorZaxisInitializer(gameObject: GameObject, onSortByZaxis: (z: number) => void): void {
        if (!gameObject.transform.parentTransform) return;
        let currentAncestor = gameObject.transform.parentTransform;
        while (currentAncestor) {
            const zaxisInitializer: ZaxisSortable|null = currentAncestor.gameObject.getComponent(ZaxisSortable);
            if (zaxisInitializer) {
                onSortByZaxis(currentAncestor.position.z);
                return;
            }
            if (currentAncestor.parentTransform === null) break;
            currentAncestor = currentAncestor.parentTransform;
        }
    }   

    public get runOnce(): boolean {
        return this._runOnce;
    }

    public set runOnce(value: boolean) {
        this._runOnce = value;
    }
}
