import { IEngine } from "../IEngine";
import { Scene } from "../hierarchy_object/Scene";
import { SceneBuilder } from "./SceneBuilder";

export interface IBootstrapper {
    run(scene: Scene, engine: IEngine): SceneBuilder;
}
