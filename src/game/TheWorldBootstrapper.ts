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
import { GridEventMap } from "./component/event/GridEventMap";
import { Vector3 } from "three";
import { PlayerStatusRenderController } from "./component/controller/PlayerStatusRenderController";

export class TheWorldBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        const player: PrefabRef<GameObject> = new PrefabRef();
        const playerStatusRenderController: PrefabRef<PlayerStatusRenderController> = new PrefabRef();
        const collideTilemap: PrefabRef<CssCollideTilemapChunkRenderer> = new PrefabRef();
        const gridEventMap: PrefabRef<GridEventMap> = new PrefabRef();
        const gridPointer: PrefabRef<GridPointer> = new PrefabRef();

        return this.sceneBuilder
            .withChild(instantlater.buildPrefab("tilemap", SansFightRoomPrefab)
                .getColideTilemapChunkRendererRef(collideTilemap).make())

            .withChild(instantlater.buildGameObject("eventmap", new Vector3(8, 8, 0))
                .withComponent(GridEventMap, c => {
                    c.gridCellWidth = collideTilemap.ref!.gridCellWidth;
                    c.gridCellHeight = collideTilemap.ref!.gridCellHeight;
                    c.showEvents = true;

                    const sansEvent = (_gridX: number, _gridY: number, target: GameObject) => {
                        playerStatusRenderController.ref!.setChatBoxText("i want some bad time", 1);
                    }

                    c.addEvent(32, 0, sansEvent);
                    c.addEvent(32, -1, sansEvent);
                    c.addEvent(32, -2, sansEvent);
                })
                .getComponent(GridEventMap, gridEventMap))

            .withChild(instantlater.buildPrefab("player", PlayerPrefab)
                .with4x4SpriteAtlasFromPath(new PrefabRef("/assets/charactor/Heewon.png"))
                .withCollideMap(collideTilemap)
                .withGridEventMap(gridEventMap)
                .withPathfindPointer(gridPointer).make()
                .getGameObject(player)
                .getComponent(PlayerStatusRenderController, playerStatusRenderController))
            
            .withChild(instantlater.buildPrefab("grid_input", GridInputPrefab)
                .withCollideMap(collideTilemap)
                .getGridPointer(gridPointer).make())
                
            .withChild(instantlater.buildPrefab("camera_controller", CameraPrefab)
                .withTrackTarget(player).make());
    }
}
