import { Component } from "../../engine/hierarchyObject/Component";
import { GameObject } from "../../engine/hierarchyObject/GameObject";

export class ZaxisInitializer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _runOnce: boolean = true;

    protected start(): void { 
        this.update();
        if (!this._runOnce) return;
        this.gameObject.removeComponent(this);
    }

    public update(): void { 
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
    
    get runOnce(): boolean {
        return this._runOnce;
    }

    set runOnce(value: boolean) {
        this._runOnce = value;
    }
}
