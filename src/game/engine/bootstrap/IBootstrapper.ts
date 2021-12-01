import { GameManager } from "../GameManager";
import { Scene } from "../hierarchyObject/Scene";
import { SceneBuilder } from "./SceneBuilder";

export interface IBootstrapper {
    run(scene: Scene, gameManager: GameManager): SceneBuilder;
}
