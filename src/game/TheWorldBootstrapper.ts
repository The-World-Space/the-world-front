import { Quaternion, Vector2, Vector3 } from "three";
import { CssSpriteAtlasRenderer } from "./component/render/CssSpriteAtlasRenderer";
import { CssSpriteRenderer } from "./component/render/CssSpriteRenderer";
import { IframeRenderer } from "./component/render/IframeRenderer";
import { SpriteAnimator } from "./component/render/SpriteAnimator";
import { SpriteAtlasAnimator } from "./component/render/SpriteAtlasAnimator";
import { ZaxisInitializer } from "./component/render/ZaxisInitializer";
import { ZaxisSorter } from "./component/render/ZaxisSorter";
import { TestExectuer } from "./component/TestExectuer";
import { IBootstrapper } from "./engine/bootstrap/IBootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameManager } from "./engine/GameManager";
import { Scene } from "./engine/hierarchyObject/Scene";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { TestTilemapChunkPrefab } from "./prefab/TestTilemapChunkPrefab";
import { TestTilemapPrefab } from "./prefab/TestTilemapPrefab";

export class TheWorldBootstrapper implements IBootstrapper {
    public run(scene: Scene, gameManager: GameManager): SceneBuilder {
        const instantlater = gameManager.instantlater;
        const camera = gameManager.camera;

        camera.position.set(0, 0, 50);

        let charactorAnimator: SpriteAtlasAnimator|null = null;
        let tileAnimator: SpriteAnimator|null = null;

        return new SceneBuilder(scene)
            .withChild(instantlater.buildGameObject("iframe1", new Vector3(32, 32, 0), new Quaternion(), new Vector3(0.3, 0.3, 1))
                .withComponent(ZaxisSorter)
                .withComponent(IframeRenderer, c => {
                    c.iframeSource = "https://www.youtube.com/embed/8nevghw8xbM";
                    c.width = 640;
                    c.height = 360;
                    c.iframeCenterOffset = new Vector2(0, 0.5);
                }))
            .withChild(instantlater.buildPrefab("tilemap_chunk1", TestTilemapChunkPrefab, new Vector3(0, 0, -2000)).make()
                .withComponent(ZaxisInitializer))
            .withChild(instantlater.buildPrefab("tilemap1", TestTilemapPrefab, new Vector3(0, 0, -100)).make()
                .withComponent(ZaxisInitializer))
            .withChild(instantlater.buildGameObject("obj1")
                .withChild(instantlater.buildGameObject("obj1.1", new Vector3(0, 32, 0))
                    .withComponent(CssSpriteAtlasRenderer, c => {
                        c.setImage(`${process.env.PUBLIC_URL}/assets/charactor/Hyeonjong.png`, 4, 4);
                        c.imageCenterOffset = new Vector2(0, 0.5);
                    })
                    .withComponent(SpriteAtlasAnimator, c => {
                        c.addAnimation("down_idle", [0]);
                        c.addAnimation("right_idle", [4]);
                        c.addAnimation("up_idle", [8]);
                        c.addAnimation("left_idle", [12]);
                        c.addAnimation("down_walk", [0, 1, 2, 3]);
                        c.addAnimation("right_walk", [4, 5, 6, 7]);
                        c.addAnimation("up_walk", [8, 9, 10, 11]);
                        c.addAnimation("left_walk", [12, 13, 14, 15]);
                        c.frameDuration = 0.2;
                        charactorAnimator = c;
                    })
                    .withComponent(ZaxisSorter)))

            .withChild(instantlater.buildPrefab("test player1", PlayerPrefab, new Vector3(0, -32, 0))
                .with4x4SpriteAtlasFromPath(`${process.env.PUBLIC_URL}/assets/charactor/Seongwon.png`).make())

            .withChild(instantlater.buildGameObject("obj2", new Vector3(0, 0, 0))
                .withComponent(CssSpriteRenderer)
                .withComponent(SpriteAnimator)
                .withComponent(ZaxisSorter))

            .withChild(instantlater.buildGameObject("obj3", new Vector3(10, 12, 0))
                .withComponent(CssSpriteRenderer, c => c.imagePath = `${process.env.PUBLIC_URL}/assets/tileRoom3/11.png`)
                .withComponent(ZaxisSorter))

            .withChild(instantlater.buildGameObject("charactor1", new Vector3(-16, -16, 0))
                .withComponent(CssSpriteRenderer)
                .withComponent(SpriteAnimator, c => {
                    c.addAnimationFromPath("test_anim1", [
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/1.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/2.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/3.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/4.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/5.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/6.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/7.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/8.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/9.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/10.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/11.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/12.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/13.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/14.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/15.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/16.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/17.png`,
                        `${process.env.PUBLIC_URL}/assets/tileRoom3/18.png`,
                    ]);
                    c.frameDuration = 0.1;
                    tileAnimator = c;
                })
                .withComponent(ZaxisSorter))

            .withChild(instantlater.buildGameObject("test_executer1")
                .withComponent(TestExectuer, c => {
                    c.setTestFunc(() => {
                        charactorAnimator?.playAnimation("down_walk");
                        tileAnimator?.playAnimation("test_anim1");
                    })
                }));
    }
}
