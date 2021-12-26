// import { Vector2 } from "three";
import { Tools } from "../../components/organisms/EditorInner/ObjectEditorInner";
// import { GameObject } from "../engine/hierarchy_object/GameObject";

export interface IWorldEditorAction {
    setToolType(tools: Tools): void;
    setViewObject(imageUrl: string, width: number, height: number): void;
    clearViewObject(): void;
    clearColliders(): void;
}


export class WorldEditorConnector {
    private _action: IWorldEditorAction | null = null;

    setToolType(...args: Parameters<IWorldEditorAction["setToolType"]>): void {
        return this._action?.setToolType(...args);
    }

    set action(action: IWorldEditorAction) {
        this._action = action;
    }
}