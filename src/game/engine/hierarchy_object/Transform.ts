import { Object3D } from "three";
import { GameObject } from "./GameObject";
import { ITransform } from "./ITransform";
import { Scene } from "./Scene";

export class Transform extends Object3D implements ITransform {
    private _gameObject: GameObject;

    public constructor(gameObject: GameObject) {
        super();
        this._gameObject = gameObject;
    }

    public foreachChild(callback: (transform: ITransform) => void): void {
        for (const child of this.children) {
            if (child instanceof Transform) {
                callback(child);
            }
        }
    }

    public get parentTransform(): ITransform | null {
        if (this.parent instanceof Scene) return null;
        return this.parent as ITransform | null;
    }

    public get childrenTransform(): ITransform[] {
        return this.children.filter(child => child instanceof Transform) as Transform[];
    }

    public get gameObject(): GameObject {
        return this._gameObject;
    }
}
