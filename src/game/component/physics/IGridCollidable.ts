import { Vector2 } from "three";

export interface IGridCollidable {
    checkCollision(x: number, y: number, width: number, height: number): boolean;
    get gridCellWidth(): number;
    get gridCellHeight(): number;
    get gridCenterX(): number;
    get gridCenterY(): number;
    get gridCenter(): Vector2;
}
