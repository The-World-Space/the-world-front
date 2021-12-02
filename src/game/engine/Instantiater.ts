import { Quaternion, Vector3 } from "three";
import { GameManager } from "./GameManager";
import { GameObject, GameObjectBuilder } from "./hierarchy_object/GameObject";
import { Prefab } from "./hierarchy_object/Prefab";
import { PrefabConstructor } from "./hierarchy_object/PrefabConstructor";

export class Instantiater {
    private readonly _gameManager: GameManager;
    
    public constructor(gameManager: GameManager) {
        this._gameManager = gameManager;
    }

    /**
     * create a new GameObject with the given name and add it to the root scene
     * @param name 
     * @param localPosition
     * @param localRotation
     * @param localScale
     * @returns 
     */
    public createGameObject(
        name: string,
        localPosition?: Vector3,
        localRotation?: Quaternion,
        localScale?: Vector3
    ): GameObject {
        const gameObject = new GameObject(this._gameManager, name);
        if (localPosition) gameObject.position.copy(localPosition);
        if (localRotation) gameObject.quaternion.copy(localRotation);
        if (localScale) gameObject.scale.copy(localScale);
        return gameObject;
    }

    /**
     * create a new GameObject with the given name and add it to the root scene by use builder
     * @param name
     * @param localPosition
     * @param localRotation
     * @param localScale
     * @returns
     */
    public buildGameObject(
        name: string,
        localPosition?: Vector3,
        localRotation?: Quaternion,
        localScale?: Vector3
    ): GameObjectBuilder {
        return new GameObject.Builder(this._gameManager, name, localPosition, localRotation, localScale);
    }

    /**
     * create a new instance of Prefab with the given name and add it to the root scene by use builder
     * @param name
     * @param localPosition
     * @param localRotation
     * @param localScale
     * @returns
     */
    public buildPrefab<T extends Prefab>(
        name: string,
        prefabCtor: PrefabConstructor<T>,
        localPosition?: Vector3,
        localRotation?: Quaternion,
        localScale?: Vector3
    ): T {
        return new prefabCtor(this._gameManager, name, localPosition, localRotation, localScale);
    }
}
