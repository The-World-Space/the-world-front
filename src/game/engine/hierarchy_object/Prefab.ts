import { Quaternion, Vector3 } from "three";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { IEngine } from "../IEngine";
import { GameObject, GameObjectBuilder } from "./GameObject";

export abstract class Prefab {
    protected _engine: IEngine;
    protected _gameObjectBuilder: GameObjectBuilder;

    public constructor(engineGlobalObject: EngineGlobalObject, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3) {
        this._engine = engineGlobalObject;
        this._gameObjectBuilder = new GameObject.GameObjectBuilder(engineGlobalObject, name, localPosition, localRotation, localScale);
    }

    public abstract make(): GameObjectBuilder;

    protected get engine(): IEngine {
        return this._engine;
    }

    protected get gameObjectBuilder(): GameObjectBuilder {
        return this._gameObjectBuilder;
    }
}
