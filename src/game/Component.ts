import { GameObject } from "./GameObject";

export abstract class Component {
    protected gameObject: GameObject;

    public constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    public start(): void { }

    public update(): void { }

    public destroy(): void { }
}
