import { Euler, MathUtils, Quaternion, Vector2, Vector3 } from "three";
import { PathfindTest } from "./component/ai/PathfindTest";
import { CameraController } from "./component/controller/CameraController";
import { PlayerGridMovementController } from "./component/controller/PlayerGridMovementController";
import { GridPointer } from "./component/input/GridPointer";
import { PointerGridInputListener } from "./component/input/PointerGridInputListener";
import { CssCollideTilemapChunkRenderer } from "./component/physics/CssCollideTilemapChunkRenderer";
import { GridCollideMap } from "./component/physics/GridColideMap";
import { CameraRelativeZaxisSorter } from "./component/render/CameraRelativeZaxisSorter";
import { IframeRenderer } from "./component/render/IframeRenderer";
import { ZaxisSorter } from "./component/render/ZaxisSorter";
import { IBootstrapper } from "./engine/bootstrap/IBootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameManager } from "./engine/GameManager";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { Scene } from "./engine/hierarchy_object/Scene";
import { PrefabRef } from "./engine/PrefabRef";
import { InstancedObjectsPrefab } from "./prefab/InstancedObjectsPrefab";
import { NetworkPlayerPrefab } from "./prefab/NetworkPlayerPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { TilemapChunkPrefab } from "./prefab/TilemapChunkPrefab";

export class TheWorldBootstrapper implements IBootstrapper {
    public run(scene: Scene, gameManager: GameManager): SceneBuilder {
        const instantlater = gameManager.instantlater;

        let player: PrefabRef<GameObject> = new PrefabRef();
        let collideTilemap: PrefabRef<CssCollideTilemapChunkRenderer> = new PrefabRef();
        let collideMap: PrefabRef<GridCollideMap> = new PrefabRef();
        let gridPointer: PrefabRef<GridPointer> = new PrefabRef();

        return new SceneBuilder(scene)
            .withChild(instantlater.buildPrefab("tilemap", TilemapChunkPrefab)
                .getColideTilemapChunkRendererRef(collideTilemap).make())

            .withChild(instantlater.buildPrefab("objects", InstancedObjectsPrefab)
                .getGridCollideMapRef(collideMap).make())

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
                .withGridPosition(new PrefabRef(new Vector2(-1, -1)))
                .make())

            .withChild(instantlater.buildGameObject("iframe", new Vector3(7 * 16 + 1, 5 * 16 + 7, 0),
                new Quaternion().setFromEuler(new Euler(MathUtils.degToRad(15), MathUtils.degToRad(-45), 0)))
                .withComponent(IframeRenderer, c => {
                    c.iframeSource = "https://www.youtube.com/embed/_6u84iKQxUU";
                    c.width = 36;
                    c.height = 18;
                    c.viewScale = 0.1;
                    c.iframeCenterOffset = new Vector2(0, 0.5);
                })
                .withComponent(ZaxisSorter))
            
            .withChild(instantlater.buildGameObject("camera_controller")
                .withComponent(CameraController, c => {
                    c.setTrackTarget(player.ref!);
                }))
            
            .withChild(instantlater.buildGameObject("grid_input", new Vector3(8, 8, 0))
                .withComponent(CameraRelativeZaxisSorter, c => c.offset = -450)
                .withComponent(PointerGridInputListener, c => {
                    c.inputWidth = 512;
                    c.inputHeight = 512;
                    c.setGridInfoFromCollideMap(collideTilemap.ref!);
                })
                .withComponent(GridPointer, c => c.pointerZoffset = 400)
                .getComponent(GridPointer, gridPointer))

            .withChild(instantlater.buildGameObject("pathfind_test", new Vector3(8, 8, 0))
                .withComponent(PathfindTest, c => {
                    c.collideMaps = [
                        collideMap.ref!,
                        collideTilemap.ref!,
                    ];
                    c.gridPointer = gridPointer.ref!;
                    c.player = player.ref!.getComponent(PlayerGridMovementController)!;
                }));

            // .withChild(instantlater.buildGameObject("test_brush")
            //     .withComponent(TestTileBrush, c => {
            //         c.colideTilemapChunk = collideTilemap.ref!;
            //         c.gridPointer = gridPointer.ref!;
            //     }));
    }
}
