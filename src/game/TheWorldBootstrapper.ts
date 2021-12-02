import { Quaternion, Vector2, Vector3 } from "three";
import { CameraController } from "./component/controller/CameraController";
//import { CssCollideTilemapChunkRenderer } from "./component/physics/CssCollideTilemapChunkRenderer";
import { CssCollideTilemapRenderer } from "./component/physics/CssCollideTilemapRenderer";
import { IframeRenderer } from "./component/render/IframeRenderer";
import { ZaxisSorter } from "./component/render/ZaxisSorter";
import { IBootstrapper } from "./engine/bootstrap/IBootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameManager } from "./engine/GameManager";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { Scene } from "./engine/hierarchy_object/Scene";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { TestTilemapChunkPrefab } from "./prefab/TestTilemapChunkPrefab";
import { TestTilemapPrefab } from "./prefab/TestTilemapPrefab";

export class TheWorldBootstrapper implements IBootstrapper {
    public run(scene: Scene, gameManager: GameManager): SceneBuilder {
        const instantlater = gameManager.instantlater;

        let player: {ref: GameObject|null} = {ref: null};
        let colideTilemap: {ref: CssCollideTilemapRenderer|null} = {ref: null};
        //let colideTilemap: {ref: CssCollideTilemapChunkRenderer|null} = {ref: null};

        return new SceneBuilder(scene)
            .withChild(instantlater.buildPrefab("tilemap_chunk", TestTilemapChunkPrefab, new Vector3(0, 0, -200))
                //.getColideTilemapRendererRef(colideTilemap)
                .make())
            
            .withChild(instantlater.buildPrefab("tilemap", TestTilemapPrefab, new Vector3(0, 0, -100))
                .getColideTilemapRendererRef(colideTilemap).make())

            .withChild(instantlater.buildPrefab("player", PlayerPrefab)
                .with4x4SpriteAtlasFromPath(`${process.env.PUBLIC_URL}/assets/charactor/Seongwon.png`)
                .withColideTilemap(colideTilemap.ref!).make()
                .getGameObject(player))

            .withChild(instantlater.buildGameObject("iframe", new Vector3(64, 4, 0), new Quaternion(), new Vector3(0.3, 0.3, 1))
                .withComponent(IframeRenderer, c => {
                    c.iframeSource = "https://www.youtube.com/embed/_6u84iKQxUU";
                    c.width = 640 / 2;
                    c.height = 360 / 2;
                    c.iframeCenterOffset = new Vector2(0, 0.5);
                })
                .withComponent(ZaxisSorter))
            
            .withChild(instantlater.buildGameObject("camera_controller")
                .withComponent(CameraController, c => {
                    c.setTrackTarget(player.ref!);
                }))
    }
}
