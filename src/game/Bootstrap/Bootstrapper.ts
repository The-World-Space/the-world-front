import { Vector3 } from "three";
import { CssSpriteRenderer } from "../component/CssSpriteRenderer";
import { ZaxisSorter } from "../component/ZaxisSorter";
import { GameManager } from "../GameManager";
import { SceneBuilder } from "./SceneBuilder";

export class Bootstrapper {
    public static run(scene: THREE.Scene, gameManager: GameManager): SceneBuilder {
        const instantlater = gameManager.instantlater;
        const camera = gameManager.camera;

        gameManager.camera.position.set(0, 0, 50);

        return new SceneBuilder(scene)
            .withChild(instantlater.buildGameObject("obj1")
                .withChild(instantlater.buildGameObject("obj1.1")))
            .withChild(instantlater.buildGameObject("obj2", new Vector3(0, 0, 0))
                .withComponent(CssSpriteRenderer)
                .withComponent(ZaxisSorter))
            .withChild(instantlater.buildGameObject("obj3", new Vector3(10, 12, 0))
                .withComponent(CssSpriteRenderer, c => c.imagePath = `${process.env.PUBLIC_URL}/assets/tileRoom3/11.png`)
                .withComponent(ZaxisSorter))
            .withChild(instantlater.buildGameObject("obj4"));
    }
}