import { Directable, Direction, ReadonlyVector2, WritableVector2 } from "the-world-engine";
import { Vector2 } from "three/src/Three";

import { PlayerNetworker } from "../networker/PlayerNetworker";

export class NetworkGridMovementController extends Directable {
    public readonly disallowMultipleComponent: boolean = true;
    
    private _speed = 80;
    private _gridCellHeight = 1;
    private _gridCellWidth = 1;
    private readonly _gridCenter: Vector2 = new Vector2();
    private readonly _currentPosition: Vector2 = new Vector2();
    private readonly _targetPosition: Vector2 = new Vector2();
    private readonly _initPosition: Vector2 = new Vector2(); //integer position
    private _networkManager: PlayerNetworker | null = null;
    private _userId: string | null = null;
    
    public start(): void {
        const transform = this.gameObject.transform;
        this.transform.position.x = this._gridCenter.x + this._initPosition.x * this._gridCellWidth;
        this.transform.position.y = this._gridCenter.y + this._initPosition.y * this._gridCellHeight;
        this._currentPosition.set(transform.localPosition.x, transform.localPosition.y);
    }

    public update(): void {
        this.processMovement();
    }

    public initNetwork(userId: string, networkManager: PlayerNetworker): void {
        this._networkManager = networkManager;
        this._userId = userId;
        networkManager.ee.on(`move_${userId}`, this.onMove);
        networkManager.ee.on(`teleport_${userId}`, this.onTeleport);
    }

    private readonly onMove = (gridPosition: Vector2): void => {
        this._targetPosition.setX(gridPosition.x * this._gridCellWidth + this._gridCenter.x);
        this._targetPosition.setY(gridPosition.y * this._gridCellHeight + this._gridCenter.y);
        this.isMoving = true;
    };

    private readonly onTeleport = (gridPosition: Vector2): void => {
        this.isMoving = false;
        
        this._currentPosition
            .copy(gridPosition)
            .multiplyScalar(this._gridCellWidth)
            .add(this._gridCenter);
        this._targetPosition
            .copy(this._currentPosition);

        const transform = this.gameObject.transform;
        transform.localPosition.x = this._currentPosition.x;
        transform.localPosition.y = this._currentPosition.y;
    };

    public onDestroy(): void {
        if (this._networkManager === null) return;
        if (this._userId === null) return;
        this._networkManager.ee.removeListener(`move_${this._userId}`, this.onMove);
    }

    private setDirection(delta: Vector2): void {
        const useX = Math.abs(delta.x) > Math.abs(delta.y);
        const dx = useX ? delta.x : 0;
        const dy = useX ? 0 : delta.y;

        this.direction = 
            (dx > 0) ? Direction.Right :
            (dx < 0) ? Direction.Left :
            (dy > 0) ? Direction.Up :
            (dy < 0) ? Direction.Down :
            this.direction;
    }

    private readonly _tempVector2a = new Vector2();
    private readonly _tempVector2b = new Vector2();

    private processMovement(): void {
        if (!this.isMoving) return;
        const transform = this.gameObject.transform;
        const vector2Pos = this._tempVector2a.set(transform.localPosition.x, transform.localPosition.y);
        const distance = vector2Pos.distanceTo(this._targetPosition);
    
        const direction = this._tempVector2b.copy(this._targetPosition).sub(vector2Pos);
        this.setDirection(direction);

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

        const oneStepDistance = this._speed * this.engine.time.deltaTime;
        if (distance < oneStepDistance) {
            this.isMoving = false;
            this._currentPosition.copy(this._targetPosition);
            transform.localPosition.x = this._targetPosition.x;
            transform.localPosition.y = this._targetPosition.y;
        } else {
            direction.multiplyScalar(oneStepDistance);
            direction.x *= syncCorrectionScalarX;
            direction.y *= syncCorrectionScalarY;

            transform.localPosition.x += direction.x;
            transform.localPosition.y += direction.y;
        }
    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(value: number) {
        this._speed = value;
    }

    public get gridCenter(): ReadonlyVector2 {
        return this._gridCenter;
    }

    public set gridCenter(value: ReadonlyVector2) {
        (this._gridCenter as WritableVector2).copy(value);
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
            Math.floor((this.transform.localPosition.x - this._gridCenter.x) / this._gridCellWidth),
            Math.floor((this.transform.localPosition.y - this._gridCenter.y) / this._gridCellHeight)
        );
    }
}
