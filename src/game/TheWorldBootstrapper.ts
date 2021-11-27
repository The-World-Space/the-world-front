import { Vector3 } from "three";
import { CssSpriteRenderer } from "./component/render/CssSpriteRenderer";
import { SpriteAnimator } from "./component/render/SpriteAnimator";
import { ZaxisSorter } from "./component/render/ZaxisSorter";
import { IBootstrapper } from "./engine/bootstrap/IBootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameManager } from "./engine/GameManager";

export class TheWorldBootstrapper implements IBootstrapper {
    public run(scene: THREE.Scene, gameManager: GameManager): SceneBuilder {
        const instantlater = gameManager.instantlater;
        //const camera = gameManager.camera;

        gameManager.camera.position.set(0, 0, 50);

        return new SceneBuilder(scene)
            .withChild(instantlater.buildGameObject("obj1")
                .withChild(instantlater.buildGameObject("obj1.1")))
            .withChild(instantlater.buildGameObject("obj2", new Vector3(0, 0, 0))
                .withComponent(CssSpriteRenderer)
                .withComponent(SpriteAnimator)
                .withComponent(ZaxisSorter))
            .withChild(instantlater.buildGameObject("obj3", new Vector3(10, 12, 0))
                .withComponent(CssSpriteRenderer, c => c.imagePath = `${process.env.PUBLIC_URL}/assets/tileRoom3/11.png`)
                .withComponent(ZaxisSorter))
            .withChild(instantlater.buildGameObject("obj4"));
    }
}
