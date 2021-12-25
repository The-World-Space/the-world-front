import { Vector3 } from "three";
import { Bootstrapper } from "../../../game/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../../../game/engine/bootstrap/SceneBuilder";
import { PrefabRef } from "../../../game/engine/hierarchy_object/PrefabRef";
import { GridInputPrefab } from "../../../game/prefab/GridInputPrefab";
import { EditorCameraController } from "../../../game/script/controller/EditorCameraController";
import { GridPointer } from "../../../game/script/input/GridPointer";
import { GridCollideMap } from "../../../game/script/physics/GridColideMap";
import { EditorGridRenderer } from "../../../game/script/post_render/EditorGridRenderer";
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

        const collideMap = new PrefabRef<GridCollideMap>();
        const gridPointer = new PrefabRef<GridPointer>();

        return this.sceneBuilder
            .withChild(instantlater.buildGameObject("camera", new Vector3(0, 0, 100))
                .withComponent(Camera, c => {
                    c.viewSize = 80;
                })
                .withComponent(EditorCameraController)
                .withComponent(EditorGridRenderer))

            .withChild(instantlater.buildGameObject("collide_map")
                .withComponent(GridCollideMap)
                .getComponent(GridCollideMap, collideMap))
            
            .withChild(instantlater.buildPrefab("grid_input", GridInputPrefab)
                .withCollideMap(collideMap)
                .getGridPointer(gridPointer).make())
            
            .withChild(instantlater.buildGameObject("test object")
                .withComponent(CssSpriteRenderer));
    }
}
