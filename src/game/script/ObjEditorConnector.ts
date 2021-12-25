import { Vector2 } from "three";
import { Tools } from "../../components/organisms/EditorInner/ObjectEditorInner";

export interface IObjEditorAction {
    setToolType(tools: Tools): void;
    setViewObject(image: unknown, width: number, height: number): void;
    getColliders(): Vector2[];
    setColliders(colliders: Vector2[]): void;
    clearColliders(): void;
}

export class ObjEditorConnector {
    private _action: IObjEditorAction | null = null;
    
    setToolType(...args: Parameters<IObjEditorAction["setToolType"]>): void {
        return this._action?.setToolType(...args);
    }

    setImageShape(...args: Parameters<IObjEditorAction["setViewObject"]>): void {
        return this._action?.setViewObject(...args);
    }

    getColliderShape(...args: Parameters<IObjEditorAction["getColliders"]>): Vector2[] {
        return this._action?.getColliders(...args) ?? [];
    }

    setColliders(...args: Parameters<IObjEditorAction["setColliders"]>): void {
        return this._action?.setColliders(...args);
    }

    clearColliders(...args: Parameters<IObjEditorAction["clearColliders"]>): void {
        return this._action?.clearColliders(...args);
    }

    set action(action: IObjEditorAction) {
        this._action = action;
    }
}
