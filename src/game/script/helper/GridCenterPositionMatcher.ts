import { Vector2 } from "three/src/Three";
import { Component } from "the-world-engine";

export class GridCenterPositionMatcher extends Component {
    public readonly disallowMultipleComponent: boolean = true;

    protected start(): void {
        this.destroy();
    }

    public setGridCenter(vector2: Vector2): void {
        this.gameObject.transform.localPosition.x += vector2.x;
        this.gameObject.transform.localPosition.y += vector2.y;
    }
}
