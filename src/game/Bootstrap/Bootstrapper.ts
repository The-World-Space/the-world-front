import { TestComponent } from "../component/TestComponent";
import { GameManager } from "../GameManager";
import { SceneBuilder } from "./SceneBuilder";

export class Bootstrapper {
    static run(scene: THREE.Scene, gameManager: GameManager): SceneBuilder {
        const instantlater = gameManager.instantlater;

        return new SceneBuilder(scene)
            .withChild(instantlater.buildGameObject("obj1")
                .withComponent(TestComponent, _ => {
                    console.log("initialize");
                })
                .withComponent(TestComponent, _ => {
                    console.log("initialize");
                }))
            .withChild(instantlater.buildGameObject("obj2"))
            .withChild(instantlater.buildGameObject("obj3"))
            .withChild(instantlater.buildGameObject("obj4"));
    }
}