import { Vector2, Vector3 } from "three";
import { Directionable } from "./Directionable";

export class NetworkGridMovementController extends Directionable {
    private _speed: number = 96;
    private _gridCellHeight: number = 16;
    private _gridCellWidth: number = 16;
    private readonly _gridCenter: Vector2 = new Vector2();
    private readonly _currentGridPosition: Vector2 = new Vector2();
    private readonly _targetGridPosition: Vector2 = new Vector2();
    private readonly _initPosition: Vector2 = new Vector2(); //integer position

    private readonly _tempVector3: Vector3 = new Vector3();
    
    protected start(): void {
        const worldPosition = this.gameObject.getWorldPosition(this._tempVector3);
        worldPosition.x = this._gridCenter.x + this._initPosition.x * this._gridCellWidth;
        worldPosition.y = this._gridCenter.y + this._initPosition.y * this._gridCellHeight;
        this.gameObject.position.copy(this.gameObject.parent!.worldToLocal(worldPosition));
        this._currentGridPosition.set(this.gameObject.position.x, this.gameObject.position.y);
    }

    public update(): void {
        this.processNetwork();
        this.processMovement();
    }

    private processNetwork(): void {

    }

    private processMovement(): void {

    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(value: number) {
        this._speed = value;
    }

    public get gridCenter(): Vector2 {
        return this._gridCenter.clone();
    }

    public set gridCenter(value: Vector2) {
        this._gridCenter.copy(value);
    }

    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    public set gridCellHeight(value: number) {
        this._gridCellHeight = value;
    }

    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }

    public set gridCellWidth(value: number) {
        this._gridCellWidth = value;
    }

    public set initPosition(value: Vector2) {
        this._initPosition.copy(value);
    }

    public get positionInGrid(): Vector2 {
        return new Vector2(
            Math.floor(this.gameObject.position.x / this._gridCellWidth),
            Math.floor(this.gameObject.position.y / this._gridCellHeight)
        );
    }
}
