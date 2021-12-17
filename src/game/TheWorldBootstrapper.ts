import { Vector3 } from "three";
import { GridPointer } from "./component/input/GridPointer";
import { CssCollideTilemapChunkRenderer } from "./component/physics/CssCollideTilemapChunkRenderer";
import { IBootstrapper } from "./engine/bootstrap/IBootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { Scene } from "./engine/hierarchy_object/Scene";
import { PrefabRef } from "./engine/hierarchy_object/PrefabRef";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { GridInputPrefab } from "./prefab/GridInputPrefab";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { SansFightRoomPrefab } from "./prefab/SansFightRoomPrefab";
import { IEngine } from "./engine/IEngine";

export class TheWorldBootstrapper implements IBootstrapper {
    public run(scene: Scene, engine: IEngine): SceneBuilder {
        const instantlater = engine.instantlater;

        const player: PrefabRef<GameObject> = new PrefabRef();
        const collideTilemap: PrefabRef<CssCollideTilemapChunkRenderer> = new PrefabRef();
        const gridPointer: PrefabRef<GridPointer> = new PrefabRef();

        return new SceneBuilder(scene)
            .withChild(instantlater.buildPrefab("tilemap", SansFightRoomPrefab)
                .getColideTilemapChunkRendererRef(collideTilemap).make())

            .withChild(instantlater.buildPrefab("player", PlayerPrefab)
                .with4x4SpriteAtlasFromPath(new PrefabRef("/assets/charactor/Heewon.png"))
                .withCollideMap(collideTilemap)
                .withPathfindPointer(gridPointer).make()
                .getGameObject(player))
            
            .withChild(instantlater.buildPrefab("grid_input", GridInputPrefab, new Vector3(8, 8, 0))
                .withCollideMap(collideTilemap)
                .getGridPointer(gridPointer).make())
                
            .withChild(instantlater.buildPrefab("camera_controller", CameraPrefab)
                .withTrackTarget(player).make());
    }
}
