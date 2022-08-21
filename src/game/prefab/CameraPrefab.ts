import { Vector2 } from "three/src/Three";
import { TrackCameraController, Camera, GameObject, GameObjectBuilder, Prefab, PrefabRef } from "the-world-engine";

export class CameraPrefab extends Prefab {
    private _trackTarget = new PrefabRef<GameObject>();

    public withTrackTarget(target: PrefabRef<GameObject>): CameraPrefab {
        this._trackTarget = target;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(Camera, c => {
                c.viewSize = 8;
            })
            .withComponent(TrackCameraController, c => {
                c.setTrackTarget(this._trackTarget.ref!);
                c.targetOffset = new Vector2(0, 2);
            });
    }
}
