import { Vector2 } from "three";
import { Direction, Directionable } from "the-world-engine";
import { PlayerNetworker } from "../networker/PlayerNetworker";

export class NetworkGridMovementController extends Directionable {
    public readonly disallowMultipleComponent: boolean = true;
    
    private _speed: number = 80;
    private _gridCellHeight: number = 16;
    private _gridCellWidth: number = 16;
    private readonly _gridCenter: Vector2 = new Vector2();
    private readonly _currentGridPosition: Vector2 = new Vector2();
    private readonly _targetGridPosition: Vector2 = new Vector2();
    private readonly _initPosition: Vector2 = new Vector2(); //integer position
    private _networkManager: PlayerNetworker | null = null;
    private _userId: string | null = null;
    public readonly onMoveBind = this.onMove.bind(this);
    
    protected start(): void {
        const transform = this.gameObject.transform;
        this.transform.position.x = this._gridCenter.x + this._initPosition.x * this._gridCellWidth;
        this.transform.position.y = this._gridCenter.y + this._initPosition.y * this._gridCellHeight;
        this._currentGridPosition.set(transform.localPosition.x, transform.localPosition.y);
    }

    public update(): void {
        this.processMovement();
    }

    public initNetwork(userId: string, networkManager: PlayerNetworker): void {
        this._networkManager = networkManager;
        this._userId = userId;
        networkManager.ee.on(`move_${userId}`, this.onMoveBind);
    }

    private onMove(pos: Vector2): void {
        this._targetGridPosition.setX(pos.x * this._gridCellWidth + this._gridCenter.x);
        this._targetGridPosition.setY(pos.y * this._gridCellHeight + this._gridCenter.y);
        this.isMoving = true;
    }

    public onDestroy(): void {
        if (this._networkManager === null)  return;
        if (this._userId === null)          return;
        this._networkManager.ee.removeListener(`move_${this._userId}`, this.onMoveBind);
    }

    private _setDirection(delta: Vector2): void {
        const useX = Math.abs(delta.x) > Math.abs(delta.y);
        const dx = useX ? delta.x : 0;
        const dy = useX ? 0 : delta.y;

        this.direction = 
            (dx > 0) ? Direction.Right :
            (dx < 0) ? Direction.Left :
            (dy > 0) ? Direction.Up :
            (dy < 0) ? Direction.Down :
            NaN;
    }

    private processMovement(): void {
        if (!this.isMoving) return;
        const vector2Pos = new Vector2(this.gameObject.transform.localPosition.x, this.gameObject.transform.localPosition.y);
        const distance = vector2Pos.distanceTo(this._targetGridPosition);
        
        if (distance > 0.1) {
            const direction = this._targetGridPosition.clone().sub(vector2Pos);
            this._setDirection(direction);

            let syncCorrectionScalarX = 1;
            let syncCorrectionScalarY = 1;

            if (this.gridCellWidth < direction.x) {
                syncCorrectionScalarX = direction.x / this.gridCellWidth;
            }
            if (this.gridCellHeight < direction.y) {
                syncCorrectionScalarY = direction.y / this.gridCellHeight;
            }
            if (-this.gridCellWidth > direction.x) {
                syncCorrectionScalarX = -direction.x / this.gridCellWidth;
            }
            if (-this.gridCellHeight > direction.y) {
                syncCorrectionScalarY = -direction.y / this.gridCellHeight;
            }

            direction.normalize();
            direction.multiplyScalar(Math.min(this._speed * this.engine.time.deltaTime, distance));
            direction.x *= syncCorrectionScalarX;
            direction.y *= syncCorrectionScalarY;

            this.gameObject.transform.localPosition.x += direction.x;
            this.gameObject.transform.localPosition.y += direction.y;
        } else {
            this.isMoving = false;
            this._currentGridPosition.copy(this._targetGridPosition);
        }
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
            Math.floor(this.gameObject.transform.localPosition.x / this._gridCellWidth),
            Math.floor(this.gameObject.transform.localPosition.y / this._gridCellHeight)
        );
    }
}
