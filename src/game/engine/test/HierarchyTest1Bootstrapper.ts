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
                .active(true)
                .withComponent(HookTestComponent, c => {
                    console.log("obj1 initialize");
                    c.enabled = true;
                    console.log(`c.gameObject.activeSelf: ${(c as any)._gameObject.activeSelf}`);
                    console.log(`c.gameObject.activeInHierarchy: ${(c as any)._gameObject.activeInHierarchy}`);
                    setTimeout(() => {
                        console.log("obj1");
                        console.log(`c.gameObject.activeSelf: ${(c as any)._gameObject.activeSelf}`);
                        console.log(`c.gameObject.activeInHierarchy: ${(c as any)._gameObject.activeInHierarchy}`);
                        setTimeout(() => {
                            console.log("obj1");
                            console.log(`c.gameObject.activeSelf: ${(c as any)._gameObject.activeSelf}`);
                            console.log(`c.gameObject.activeInHierarchy: ${(c as any)._gameObject.activeInHierarchy}`);
                        }, 2000);
                    }, 1000);
                })
                .withChild(instantlater.buildGameObject("obj2")
                    .active(true)
                    .withComponent(HookTestComponent, c => {
                        console.log("obj2 initialize");
                        console.log(`c.gameObject.activeSelf: ${(c as any)._gameObject.activeSelf}`);
                        console.log(`c.gameObject.activeInHierarchy: ${(c as any)._gameObject.activeInHierarchy}`);
                        setTimeout(() => {
                            (c as any)._gameObject.activeSelf = false;
                            console.log("obj2");
                            console.log(`c.gameObject.activeSelf: ${(c as any)._gameObject.activeSelf}`);
                            console.log(`c.gameObject.activeInHierarchy: ${(c as any)._gameObject.activeInHierarchy}`);
                            setTimeout(() => {
                                (c as any)._gameObject.activeSelf = true;
                                console.log("obj2");
                                console.log(`c.gameObject.activeSelf: ${(c as any)._gameObject.activeSelf}`);
                                console.log(`c.gameObject.activeInHierarchy: ${(c as any)._gameObject.activeInHierarchy}`);
                            }, 2000);
                        }, 1500);
                    })
                    .withChild(instantlater.buildGameObject("obj3")
                        .active(true)
                        .withComponent(HookTestComponent, c => {
                            console.log("obj3 initialize");
                            console.log(`c.gameObject.activeSelf: ${(c as any)._gameObject.activeSelf}`);
                            console.log(`c.gameObject.activeInHierarchy: ${(c as any)._gameObject.activeInHierarchy}`);
                            setTimeout(() => {
                                console.log("obj3");
                                console.log(`c.gameObject.activeSelf: ${(c as any)._gameObject.activeSelf}`);
                                console.log(`c.gameObject.activeInHierarchy: ${(c as any)._gameObject.activeInHierarchy}`);
                                setTimeout(() => {
                                    console.log("obj3");
                                    console.log(`c.gameObject.activeSelf: ${(c as any)._gameObject.activeSelf}`);
                                    console.log(`c.gameObject.activeInHierarchy: ${(c as any)._gameObject.activeInHierarchy}`);
                                }, 2000);
                            }, 2000);
                        }))));
    }
}
