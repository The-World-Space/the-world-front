import { GameManager } from "../GameManager";
import { SceneBuilder } from "./SceneBuilder";

export interface IBootstrapper {
    run(scene: THREE.Scene, gameManager: GameManager): SceneBuilder;
}
