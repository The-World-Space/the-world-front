import { Quaternion, Vector3 } from "three";
import { GameManager } from "../GameManager";
import { GameObject, GameObjectBuilder } from "./GameObject";

export abstract class Prefab {
    protected _gameManager: GameManager;
    protected _gameObjectBuilder: GameObjectBuilder;

    public constructor(gameManager: GameManager, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3) {
        this._gameManager = gameManager;
        this._gameObjectBuilder = new GameObject.Builder(gameManager, name, localPosition, localRotation, localScale);
    }

    public abstract make(): GameObjectBuilder;
}
