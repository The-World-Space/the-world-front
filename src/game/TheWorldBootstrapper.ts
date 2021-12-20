import { GridPointer } from "./component/input/GridPointer";
import { CssCollideTilemapChunkRenderer } from "./component/physics/CssCollideTilemapChunkRenderer";
import { Bootstrapper } from "./engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { PrefabRef } from "./engine/hierarchy_object/PrefabRef";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { GridInputPrefab } from "./prefab/GridInputPrefab";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { SansFightRoomPrefab } from "./prefab/SansFightRoomPrefab";
import { CoroutineTest } from "./component/CoroutineTest";

export class TheWorldBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        const player: PrefabRef<GameObject> = new PrefabRef();
        const collideTilemap: PrefabRef<CssCollideTilemapChunkRenderer> = new PrefabRef();
        const gridPointer: PrefabRef<GridPointer> = new PrefabRef();

        return this.sceneBuilder
            .withChild(instantlater.buildPrefab("tilemap", SansFightRoomPrefab)
                .getColideTilemapChunkRendererRef(collideTilemap).make()
                .withComponent(CoroutineTest))

            .withChild(instantlater.buildPrefab("player", PlayerPrefab)
                .with4x4SpriteAtlasFromPath(new PrefabRef("/assets/charactor/Heewon.png"))
                .withCollideMap(collideTilemap)
                .withPathfindPointer(gridPointer).make()
                .getGameObject(player))
            
            .withChild(instantlater.buildPrefab("grid_input", GridInputPrefab)
                .withCollideMap(collideTilemap)
                .getGridPointer(gridPointer).make())
                
            .withChild(instantlater.buildPrefab("camera_controller", CameraPrefab)
                .withTrackTarget(player).make());
    }
}
