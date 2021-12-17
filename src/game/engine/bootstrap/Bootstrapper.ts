import { IEngine } from "../IEngine";
import { Scene } from "../hierarchy_object/Scene";
import { SceneBuilder } from "./SceneBuilder";
import { EngineGlobalObject } from "../EngineGlobalObject";

export abstract class Bootstrapper<T = {}> {
    private _engineGlobalObject: EngineGlobalObject;
    private _interopObject: T|null;

    public constructor(engineGlobalObject: EngineGlobalObject, interopObject?: T) {
        this._engineGlobalObject = engineGlobalObject;
        this._interopObject = interopObject || null;
    }

    abstract run(scene: Scene): SceneBuilder;

    protected get engine(): IEngine {
        return this._engineGlobalObject;
    }
    
    protected get interopObject(): T|null {
        return this._interopObject;
    }
}
