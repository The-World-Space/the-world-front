import { IGridCoordinatable } from "../post_render/IGridCoordinatable";

export interface IGridCollidable extends IGridCoordinatable {
    checkCollision(x: number, y: number, width: number, height: number): boolean;
}
