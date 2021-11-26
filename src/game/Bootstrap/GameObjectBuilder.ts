import { Component } from "../Component";
import { GameObject } from "../GameObject";

export class GameObjectBuilder {
    private readonly gameObject: GameObject;
    private readonly children: GameObjectBuilder[];
    private readonly componentInitializeFuncList: ((gameObject: GameObject) => void)[];

    public constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.children = [];
        this.componentInitializeFuncList = [];
    }

    public <T extends Component> withComponent(component: T): GameObjectBuilder {
        this.componentInitializeFuncList.push(component.initialize);
        return this;
    }
}