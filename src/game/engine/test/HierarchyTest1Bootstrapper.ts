import { Scene } from "three";
import { IBootstrapper } from "../bootstrap/IBootstrapper";
import { SceneBuilder } from "../bootstrap/SceneBuilder";
import { GameManager } from "../GameManager";
import { HookTestComponent } from "./HookTestComponent";

export class HierarchyTest1Bootstrapper implements IBootstrapper {
    run(scene: Scene, gameManager: GameManager): SceneBuilder {
        const instantlater = gameManager.instantlater;

        return new SceneBuilder(scene)
            .withChild(instantlater.buildGameObject("obj1")
                .withComponent(HookTestComponent, _ => {
                    console.log("obj1 initialize");
                })
                .withChild(instantlater.buildGameObject("obj2")
                    .withChild(instantlater.buildGameObject("obj3"))));
    }
}
