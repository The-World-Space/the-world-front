import { Quaternion, Vector3 } from "three";
import { GameManager } from "./GameManager";
import { GameObject, GameObjectBuilder } from "./hierarchyObject/GameObject";

export class Instantiater {
    private readonly _gameManager: GameManager;
    
    public constructor(gameManager: GameManager) {
        this._gameManager = gameManager;
    }

    /**
     * create a new GameObject with the given name and add it to the root scene
     * @param name 
     * @returns 
     */
    public createGameObject(name: string): GameObject;

    /**
     * create a new GameObject with the given name and add it to the root scene
     * @param name 
     * @param localPosition
     * @returns 
     */
    public createGameObject(name: string, localPosition?: Vector3): GameObject;

    /**
     * create a new GameObject with the given name and add it to the root scene
     * @param name 
     * @param localPosition
     * @param localRotation
     * @returns 
     */
    public createGameObject(name: string, localPosition?: Vector3, localRotation?: Quaternion): GameObject;

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
    ): GameObject;

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
     * @returns
     */
    public buildGameObject(name: string): GameObjectBuilder;

    /**
     * create a new GameObject with the given name and add it to the root scene by use builder
     * @param name
     * @param localPosition
     * @returns
     */
    public buildGameObject(name: string, localPosition?: Vector3): GameObjectBuilder;

    /**
     * create a new GameObject with the given name and add it to the root scene by use builder
     * @param name
     * @param localPosition
     * @param localRotation
     * @returns
     */
    public buildGameObject(name: string, localPosition?: Vector3, localRotation?: Quaternion): GameObjectBuilder;

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
        localScale?: Vector3): GameObjectBuilder;

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
}
