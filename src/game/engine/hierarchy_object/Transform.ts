import { Object3D } from "three";
import { GameObject } from "./GameObject";
import { ITransform } from "./ITransform";

export class Transform extends Object3D implements ITransform {
    private _gameObject: GameObject;

    public constructor(gameObject: GameObject) {
        super();
        this._gameObject = gameObject;
    }

    public get attachedGameObject(): GameObject {
        return this._gameObject;
    }
}
