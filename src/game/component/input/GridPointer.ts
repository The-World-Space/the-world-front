import { Vector2, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchy_object/Component";
import { ComponentConstructor } from "../../engine/hierarchy_object/ComponentConstructor";
import { PointerGridInputListener } from "./PointerGridInputListener";

export class GridPointer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [PointerGridInputListener];

    private _pointerGridInputListener: PointerGridInputListener|null = null;

    protected start(): void {
        this._pointerGridInputListener = this.gameObject.getComponent(PointerGridInputListener);
    }
}
