import { GameObject } from "./GameObject";

export abstract class Component {
    public gameObject: GameObject;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    abstract start(): void;

    abstract update(): void;

    abstract destroy(): void;
}
