import { Vector2 } from "three";
import { Tools } from '../../components/organisms/EditorInner/ObjectEditorInner';

export interface IObjEditorAction {
    setToolType(tools: Tools): void;
    getColliderShape(): Vector2[];
}

export class ObjEditorConnector {
    private _action: IObjEditorAction | null = null;
    
    setToolType(...args: Parameters<IObjEditorAction["setToolType"]>) {
        return this._action?.setToolType(...args);
    }

    getColliderShape(...args: Parameters<IObjEditorAction["getColliderShape"]>) {
        return this._action?.getColliderShape(...args);
    }

    set action(action: IObjEditorAction) {
        this._action = action;
    }
}
