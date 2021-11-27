import { Vector3 } from "three";
import { CssSpriteAtlasRenderer } from "./component/render/CssSpriteAtlasRenderer";
import { CssSpriteRenderer } from "./component/render/CssSpriteRenderer";
import { SpriteAnimator } from "./component/render/SpriteAnimator";
import { ZaxisSorter } from "./component/render/ZaxisSorter";
import { TestExectuer } from "./component/TestExectuer";
import { IBootstrapper } from "./engine/bootstrap/IBootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameManager } from "./engine/GameManager";

export class TheWorldBootstrapper implements IBootstrapper {
    public run(scene: THREE.Scene, gameManager: GameManager): SceneBuilder {
        const instantlater = gameManager.instantlater;
        //const camera = gameManager.camera;

        gameManager.camera.position.set(0, 0, 50);

        let charactorAnimator: SpriteAnimator|null = null;

        return new SceneBuilder(scene)
            .withChild(instantlater.buildGameObject("obj1")
                .withChild(instantlater.buildGameObject("obj1.1", new Vector3(0, 32, 0))
                    .withComponent(CssSpriteAtlasRenderer, c => {
                        c.setImage(`${process.env.PUBLIC_URL}/assets/Hyeonjong.png`, 4, 4);
                        c.imageIndex = 5;
                    })))
            .withChild(instantlater.buildGameObject("obj2", new Vector3(0, 0, 0))
                .withComponent(CssSpriteRenderer)
                .withComponent(SpriteAnimator)
                .withComponent(ZaxisSorter))
            .withChild(instantlater.buildGameObject("obj3", new Vector3(10, 12, 0))
                .withComponent(CssSpriteRenderer, c => c.imagePath = `${process.env.PUBLIC_URL}/assets/tileRoom3/11.png`)
                .withComponent(ZaxisSorter))
            .withChild(instantlater.buildGameObject("charactor", new Vector3(-16, -16, 0))
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
                    charactorAnimator = c;
                })
                .withComponent(ZaxisSorter))
            .withChild(instantlater.buildGameObject("core")
                .withComponent(TestExectuer, c => {
                    c.setTestFunc(() => {
                        charactorAnimator!.playAnimation("test_anim1");
                    })
                }));
    }
}
