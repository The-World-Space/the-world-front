import { Vector2 } from "three";
import { IGridColideable } from "../physics/IGridColideable";
import { Direction, Directionable } from "./Directionable";

export class PlayerGridMovementController extends Directionable {
    private _speed: number = 96;
    private _gridCellHeight: number = 16;
    private _gridCellWidth: number = 16;
    private _collideMap: IGridColideable|null = null;
    private readonly _collideSize: number = 8;
    private readonly _gridCenter: Vector2 = new Vector2();
    private readonly _currentGridPosition: Vector2 = new Vector2();
    private readonly _targetGridPosition: Vector2 = new Vector2();
    private readonly _initPosition: Vector2 = new Vector2(); //integer position

    protected start(): void {
        this.gameObject.position.x = this._gridCenter.x + this._initPosition.x * this._gridCellWidth;
        this.gameObject.position.y = this._gridCenter.y + this._initPosition.y * this._gridCellHeight;
        this._currentGridPosition.set(this.gameObject.position.x, this.gameObject.position.y);
    }

    public update(): void {
        this.processInput();
        this.processMovement();
    }

    private processInput(): void {
        if (this.isMoving) return;
        const inputMap = this.gameManager.inputHandler.map;
        if (inputMap.get("w") || inputMap.get("ArrowUp")) {
            this.direction = Direction.Up;
            if (this.checkCollision(this._currentGridPosition.x, this._currentGridPosition.y + this._gridCellHeight)) return;
            this._targetGridPosition.set(this._currentGridPosition.x, this._currentGridPosition.y + this._gridCellHeight);
            this.isMoving = true;
        } else if (inputMap.get("s") || inputMap.get("ArrowDown")) {
            this.direction = Direction.Down;
            if (this.checkCollision(this._currentGridPosition.x, this._currentGridPosition.y - this._gridCellHeight)) return;
            this._targetGridPosition.set(this._currentGridPosition.x, this._currentGridPosition.y - this._gridCellHeight);
            this.isMoving = true;
        } else if (inputMap.get("a") || inputMap.get("ArrowLeft")) {
            this.direction = Direction.Left;
            if (this.checkCollision(this._currentGridPosition.x - this._gridCellWidth, this._currentGridPosition.y)) return;
            this._targetGridPosition.set(this._currentGridPosition.x - this._gridCellWidth, this._currentGridPosition.y);
            this.isMoving = true;
        } else if (inputMap.get("d") || inputMap.get("ArrowRight")) {
            this.direction = Direction.Right;
            if (this.checkCollision(this._currentGridPosition.x + this._gridCellWidth, this._currentGridPosition.y)) return;
            this._targetGridPosition.set(this._currentGridPosition.x + this._gridCellWidth, this._currentGridPosition.y);
            this.isMoving = true;
        }
    }

    private noncheckProcessInput(currentGridPosotion: Vector2): boolean {
        const inputMap = this.gameManager.inputHandler.map;
        if (inputMap.get("w") || inputMap.get("ArrowUp")) {
            this.direction = Direction.Up;
            if (this.checkCollision(currentGridPosotion.x, currentGridPosotion.y + this._gridCellHeight)) return false;
            this._targetGridPosition.set(currentGridPosotion.x, currentGridPosotion.y + this._gridCellHeight);
            return true;
        } else if (inputMap.get("s") || inputMap.get("ArrowDown")) {
            this.direction = Direction.Down;
            if (this.checkCollision(currentGridPosotion.x, currentGridPosotion.y - this._gridCellHeight)) return false;
            this._targetGridPosition.set(currentGridPosotion.x, currentGridPosotion.y - this._gridCellHeight);
            return true;
        } else if (inputMap.get("a") || inputMap.get("ArrowLeft")) {
            this.direction = Direction.Left;
            if (this.checkCollision(currentGridPosotion.x - this._gridCellWidth, currentGridPosotion.y)) return false;
            this._targetGridPosition.set(currentGridPosotion.x - this._gridCellWidth, currentGridPosotion.y);
            return true;
        } else if (inputMap.get("d") || inputMap.get("ArrowRight")) {
            this.direction = Direction.Right;
            if (this.checkCollision(currentGridPosotion.x + this._gridCellWidth, currentGridPosotion.y)) return false;
            this._targetGridPosition.set(currentGridPosotion.x + this._gridCellWidth, currentGridPosotion.y);
            return true;
        }
        return false;
    }

    private processMovement(): void {
        if (this.isMoving) {
            const vector2Pos = new Vector2(this.gameObject.position.x, this.gameObject.position.y);
            let distance = vector2Pos.distanceTo(this._targetGridPosition);

            if (distance < this._speed * this.gameManager.time.deltaTime) {
                if (this.noncheckProcessInput(this._targetGridPosition)) {
                    distance = vector2Pos.distanceTo(this._targetGridPosition);
                }
            }

            if (distance > 0.1) {
                let direction = this._targetGridPosition.clone().sub(vector2Pos).normalize();
                direction.multiplyScalar(Math.min(this._speed * this.gameManager.time.deltaTime, distance));
                this.gameObject.position.x += direction.x;
                this.gameObject.position.y += direction.y;
            } else {
                this.isMoving = false;
                this._currentGridPosition.copy(this._targetGridPosition);
            }
        }
    }

    private checkCollision(x: number, y: number): boolean {
        if (this._collideMap) {
            return this._collideMap.checkCollision(x, y, this._collideSize, this._collideSize);
        }
        return false;
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

    public get collideMap(): IGridColideable|null {
        return this._collideMap;
    }
    
    public set collideMap(value: IGridColideable|null) {
        this._collideMap = value;
        if (value) {
            this._gridCellWidth = value.gridCellWidth;
            this._gridCellHeight = value.gridCellHeight;
            this._gridCenter.set(value.gridCenterX, value.gridCenterY);
        }
    }

    public get positionInGrid(): Vector2 {
        return new Vector2(
            Math.floor(this.gameObject.position.x / this._gridCellWidth),
            Math.floor(this.gameObject.position.y / this._gridCellHeight)
        );
    }
}
