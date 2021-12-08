import { Vector2, Vector3 } from "three";
import { GridPointer } from "./component/input/GridPointer";
import { TestTileBrush } from "./component/input/TestTileBrush";
import { CssCollideTilemapChunkRenderer } from "./component/physics/CssCollideTilemapChunkRenderer";
import { GridCollideMap } from "./component/physics/GridColideMap";
import { IBootstrapper } from "./engine/bootstrap/IBootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameManager } from "./engine/GameManager";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { Scene } from "./engine/hierarchy_object/Scene";
import { PrefabRef } from "./engine/hierarchy_object/PrefabRef";
import { InstancedObjectsPrefab } from "./prefab/InstancedObjectsPrefab";
import { NetworkPlayerPrefab } from "./prefab/NetworkPlayerPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { TilemapChunkPrefab } from "./prefab/TilemapChunkPrefab";
import { GridInputPrefab } from "./prefab/GridInputPrefab";
import { CameraPrefab } from "./prefab/CameraPrefab";

export class TheWorldBootstrapper implements IBootstrapper {
    public run(scene: Scene, gameManager: GameManager): SceneBuilder {
        const instantlater = gameManager.instantlater;

        const player: PrefabRef<GameObject> = new PrefabRef();
        const collideTilemap: PrefabRef<CssCollideTilemapChunkRenderer> = new PrefabRef();
        const collideMap: PrefabRef<GridCollideMap> = new PrefabRef();
        const gridPointer: PrefabRef<GridPointer> = new PrefabRef();

        return new SceneBuilder(scene)
            .withChild(instantlater.buildPrefab("tilemap", TilemapChunkPrefab)
                .getColideTilemapChunkRendererRef(collideTilemap).make())

            .withChild(instantlater.buildPrefab("objects", InstancedObjectsPrefab)
                .getGridCollideMap(collideMap).make())

            .withChild(instantlater.buildPrefab("player", PlayerPrefab)
                .withNameTag(new PrefabRef("steve jobs"))
                .withCollideMap(collideTilemap)
                .withCollideMap(collideMap)
                .withPathfindPointer(gridPointer).make()
                .getGameObject(player))
            
            .withChild(instantlater.buildPrefab("network_player", NetworkPlayerPrefab)
                .withNameTag(new PrefabRef("Heewon"))
                .with4x4SpriteAtlasFromPath(new PrefabRef("/assets/charactor/Heewon.png"))
                .withGridInfo(collideTilemap)
                .withGridPosition(new PrefabRef(new Vector2(-1, -1))).make())
            
            .withChild(instantlater.buildPrefab("grid_input", GridInputPrefab, new Vector3(8, 8, 0))
                .withCollideMap(collideMap)
                .getGridPointer(gridPointer).make())

            .withChild(instantlater.buildGameObject("test_brush")
                .withComponent(TestTileBrush, c => {
                    c.colideTilemapChunk = collideTilemap.ref!;
                    c.gridPointer = gridPointer.ref!;
                    setTimeout(() => {
                        const checkbox = document.getElementById("test_check_box") as HTMLInputElement;
                        checkbox.onchange = () => {
                            c.enabled = checkbox.checked;
                        };
                    }, 1000);
                }))
                
            .withChild(instantlater.buildPrefab("camera_controller", CameraPrefab)
                .withTrackTarget(player).make());
    }
}
