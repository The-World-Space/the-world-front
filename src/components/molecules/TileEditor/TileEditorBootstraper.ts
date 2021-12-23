
import { Bootstrapper } from "../../../game/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../../../game/engine/bootstrap/SceneBuilder";
import { CameraPrefab } from "../../../game/prefab/CameraPrefab";


export class EditorInfoObject {
    private readonly _eventTargetDom: HTMLElement;

    public constructor(
            eventTargetDom: HTMLElement) {
        this._eventTargetDom = eventTargetDom;
    }
    
    public get eventTargetDom(): HTMLElement {
        return this._eventTargetDom;
    }
}


export class TileEditorBootstraper extends Bootstrapper<EditorInfoObject> {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        return this.sceneBuilder
            .withChild(instantlater.buildPrefab("camera_controller", CameraPrefab).make())
    }
}
