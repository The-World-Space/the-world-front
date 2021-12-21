import { Vector2 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";

export class GridCenterPositionMatcher extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private readonly _gridCenter: Vector2 = new Vector2();

    protected start(): void {
        this.gameObject.transform.position.x += this._gridCenter.x;
        this.gameObject.transform.position.y += this._gridCenter.y;
        this.gameObject.removeComponent(this);
    }

    public setGridCenter(vector2: Vector2): void {
        this._gridCenter.copy(vector2);
    }
}
