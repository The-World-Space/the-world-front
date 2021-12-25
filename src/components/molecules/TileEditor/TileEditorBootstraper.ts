import { Vector3 } from "three";
import { Bootstrapper } from "../../../game/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../../../game/engine/bootstrap/SceneBuilder";
import { EditorCameraController } from "../../../game/script/controller/EditorCameraController";
import { Camera } from "../../../game/script/render/Camera";
import { CssSpriteRenderer } from "../../../game/script/render/CssSpriteRenderer";

export class EditorInfoObject {
    private readonly _eventTargetDom: HTMLElement;

    public constructor(
        eventTargetDom: HTMLElement
    ) {
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
            .withChild(instantlater.buildGameObject("camera", new Vector3(0, 0, 100))
                .withComponent(Camera, c => {
                    c.viewSize = 50;
                })
                .withComponent(EditorCameraController))
            .withChild(instantlater.buildGameObject("test object")
                .withComponent(CssSpriteRenderer));
    }
}
