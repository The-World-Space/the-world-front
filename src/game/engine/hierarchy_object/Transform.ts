import { Object3D } from "three";
import { GameObject } from "./GameObject";
import { ITransform } from "./ITransform";
import { Scene } from "./Scene";

export class Transform extends Object3D implements ITransform {
    private _gameObject: GameObject;

    public get parentTransform(): ITransform | null {
        if (this.parent instanceof Scene) return null;
        return this.parent as ITransform | null;
    }

    public get childrenTransform(): ITransform[] {
        return this.children as Transform[];
    }

    public constructor(gameObject: GameObject) {
        super();
        this._gameObject = gameObject;
    }

    public get gameObject(): GameObject {
        return this._gameObject;
    }
}
