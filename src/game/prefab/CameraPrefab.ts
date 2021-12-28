import { Vector2 } from "three";
import { CameraController } from "../script/controller/CameraController";
import { Camera } from "../script/render/Camera";
import { GameObject, GameObjectBuilder, } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";

export class CameraPrefab extends Prefab {
    private _trackTarget = new PrefabRef<GameObject>();

    public withTrackTarget(target: PrefabRef<GameObject>): CameraPrefab {
        this._trackTarget = target;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(Camera)
            .withComponent(CameraController, c => {
                c.setTrackTarget(this._trackTarget.ref!);
                c.targetOffset = new Vector2(0, 32);
            });
    }
}
