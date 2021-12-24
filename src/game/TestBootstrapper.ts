import { GridPointer } from "./script/input/GridPointer";
import { CssCollideTilemapChunkRenderer } from "./script/physics/CssCollideTilemapChunkRenderer";
import { Bootstrapper } from "./engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { PrefabRef } from "./engine/hierarchy_object/PrefabRef";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { GridInputPrefab } from "./prefab/GridInputPrefab";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { SansFightRoomPrefab } from "./prefab/sansfightroom/SansFightRoomPrefab";
import { GridEventMap } from "./script/event/GridEventMap";
import { PlayerStatusRenderController } from "./script/controller/PlayerStatusRenderController";
import { GridCenterPositionMatcher } from "./script/helper/GridCenterPositionMatcher";
import { GridObjectCollideMap } from "./script/physics/GridObjectCollideMap";

export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        const player = new PrefabRef<GameObject>();
        const playerStatusRenderController = new PrefabRef<PlayerStatusRenderController>();
        const collideTilemap = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideTilemap2 = new PrefabRef<GridObjectCollideMap>();
        const gridEventMap = new PrefabRef<GridEventMap>();
        const gridPointer = new PrefabRef<GridPointer>();

        return this.sceneBuilder
            .withChild(instantlater.buildPrefab("tilemap", SansFightRoomPrefab)
                .getColideTilemapChunkRendererRef(collideTilemap)
                .getGridObjectCollideMapRef(collideTilemap2).make())

            .withChild(instantlater.buildGameObject("eventmap")
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
                .withComponent(GridCenterPositionMatcher, c => {
                    c.setGridCenter(collideTilemap.ref!.gridCenter);
                })
                .getComponent(GridEventMap, gridEventMap))

            .withChild(instantlater.buildPrefab("player", PlayerPrefab)
                .with4x4SpriteAtlasFromPath(new PrefabRef("/assets/charactor/Heewon.png"))
                .withCollideMap(collideTilemap)
                .withCollideMap(collideTilemap2)
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
