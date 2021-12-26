import { Vector2 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";

export class GridCenterPositionMatcher extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    protected start(): void {
        this.gameObject.removeComponent(this);
    }

    public setGridCenter(vector2: Vector2): void {
        this.gameObject.transform.position.x += vector2.x;
        this.gameObject.transform.position.y += vector2.y;
    }
}
