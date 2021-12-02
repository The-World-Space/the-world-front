import { Vector2 } from "three";
import { Directionable } from "./Directionable";

export class CharactorGridMovementController extends Directionable {
    private _speed: number = 16;
    private readonly _gridCenter: Vector2 = new Vector2();
    private _gridCellHeight: number = 16;
    private _gridCellWidth: number = 16;
    private readonly _currentGridPosition: Vector2 = new Vector2();
    private readonly _targetGridPosition: Vector2 = new Vector2();
    private readonly _isMoving: boolean = false;

    protected start(): void {
        
    }

    public update(): void {
        
    }

    private setTargetGridPosition(x: number, y: number): void {
        this._targetGridPosition.set(x, y);
    }

    public get gridCenter(): Vector2 {
        return this._gridCenter;
    }

    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }
}
