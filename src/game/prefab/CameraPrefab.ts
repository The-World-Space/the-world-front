import { CameraController } from "../component/controller/CameraController";
import { Camera } from "../component/render/Camera";
import { GameObject, GameObjectBuilder, } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";

export class CameraPrefab extends Prefab {
    private _trackTarget: PrefabRef<GameObject> = new PrefabRef();

    public withTrackTarget(target: PrefabRef<GameObject>): CameraPrefab {
        this._trackTarget = target;
        return this;
    }

    public make(): GameObjectBuilder {
        return this._gameObjectBuilder
            .withComponent(Camera)
            .withComponent(CameraController, c => {
                c.setTrackTarget(this._trackTarget.ref!);
            });
    }
}