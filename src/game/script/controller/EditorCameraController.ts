import { Vector2, Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { ComponentConstructor } from "../../engine/hierarchy_object/ComponentConstructor";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { Camera } from "../render/Camera";

export class EditorCameraController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [Camera];

    public onEnable(): void {
        this.engine.input
    }

    private readonly _tempVector: Vector3 = new Vector3();

    public update(): void {
    }
}
