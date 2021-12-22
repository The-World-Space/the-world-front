import { IEngine } from "../IEngine";
import { SceneBuilder } from "./SceneBuilder";
import { EngineGlobalObject } from "../EngineGlobalObject";

export abstract class Bootstrapper<T = {}> {
    private _engineGlobalObject: EngineGlobalObject;
    private _interopObject: T|null;
    private _sceneBuilder: SceneBuilder;

    public constructor(engineGlobalObject: EngineGlobalObject, interopObject?: T) {
        this._engineGlobalObject = engineGlobalObject;
        this._interopObject = interopObject || null;
        this._sceneBuilder = new SceneBuilder(this._engineGlobalObject.sceneProcessor, this._engineGlobalObject.rootScene);
    }

    abstract run(): SceneBuilder;

    protected get engine(): IEngine {
        return this._engineGlobalObject;
    }
    
    protected get interopObject(): T|null {
        return this._interopObject;
    }

    protected get sceneBuilder(): SceneBuilder {
        return this._sceneBuilder;
    }
}
