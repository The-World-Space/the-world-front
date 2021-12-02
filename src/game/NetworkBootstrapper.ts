import { Quaternion, Vector2, Vector3 } from "three";
import { CameraController } from "./component/controller/CameraController";
import { CssCollideTilemapRenderer } from "./component/physics/CssCollideTilemapRenderer";
import { CssSpriteRenderer } from "./component/render/CssSpriteRenderer";
import { IframeRenderer } from "./component/render/IframeRenderer";
import { ZaxisInitializer } from "./component/render/ZaxisInitializer";
import { ZaxisSorter } from "./component/render/ZaxisSorter";
import { GameObjectType, ServerWorld } from "./connect/types";
import { IBootstrapper } from "./engine/bootstrap/IBootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameManager } from "./engine/GameManager";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { Scene } from "./engine/hierarchy_object/Scene";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { TestTilemapChunkPrefab } from "./prefab/TestTilemapChunkPrefab";
import { TestTilemapPrefab } from "./prefab/TestTilemapPrefab";

const PREFIX = '@@twp/game/NetworkBootstrapper/';
const SIZE = 16;

export class NetworkBootstrapper implements IBootstrapper {

    constructor(private readonly serverWorld: ServerWorld) {

    }

    public run(scene: Scene, gameManager: GameManager): SceneBuilder {
        const instantlater = gameManager.instantlater;
        const sceneBuilder = new SceneBuilder(scene);

        let player: {ref: GameObject|null} = {ref: null};
        let colideTilemap: {ref: CssCollideTilemapRenderer|null} = {ref: null};

        // @ts-ignore
        globalThis.debug = sceneBuilder

        this.serverWorld.iframes.forEach((iframe, idx) => {
            sceneBuilder
                .withChild(instantlater.buildGameObject(PREFIX + `iframe_${idx}`, new Vector3(0, 0, 0), new Quaternion(), new Vector3(1, 1, 1))
                    .withComponent(IframeRenderer, c => {
                        c.iframeSource = iframe.src;
                        c.width = iframe.width * SIZE;
                        c.height = iframe.height * SIZE;
                        c.gameObject.position.set(iframe.x, iframe.y, 1);
                        c.gameObject.position.multiplyScalar(SIZE);
                        if (iframe.type === GameObjectType.Effect) {
                            c.gameObject.position.z += 10;
                        }
                        else if (iframe.type === GameObjectType.Floor) {
                            c.gameObject.position.z -= 10;
                        }
                    })
                    .withComponent(ZaxisInitializer));
        });

        this.serverWorld.images.forEach((image, idx) => {
            sceneBuilder
                .withChild(instantlater.buildGameObject(PREFIX + `image_${idx}`, new Vector3(0, 0, 0), new Quaternion(), new Vector3(1, 1, 1))
                    .withComponent(CssSpriteRenderer, c => {
                        c.imagePath = image.src;
                        // @TODO: image height / width
                        c.gameObject.position.set(image.x, image.y, 1);
                        c.gameObject.position.multiplyScalar(SIZE);
                        if (image.type === GameObjectType.Effect) {
                            c.gameObject.position.z += 10;
                        }
                        else if (image.type === GameObjectType.Floor) {
                            c.gameObject.position.z -= 10;
                        }
                    })
                    .withComponent(ZaxisInitializer));
        });

        return sceneBuilder
            .withChild(instantlater.buildPrefab("tilemap_chunk", TestTilemapChunkPrefab, new Vector3(0, 0, -200)).make())
            
            .withChild(instantlater.buildPrefab("tilemap", TestTilemapPrefab, new Vector3(0, 0, -100))
                .getColideTilemapRendererRef(colideTilemap).make())

            .withChild(instantlater.buildPrefab("player", PlayerPrefab, new Vector3(0, 0, 0))
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
