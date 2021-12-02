import { Vector2 } from "three";
import { CssCollideTilemapChunkRenderer } from "../physics/CssCollideTilemapChunkRenderer";
import { CssCollideTilemapRenderer } from "../physics/CssCollideTilemapRenderer";
import { Direction, Directionable } from "./Directionable";

export class PlayerGridMovementController extends Directionable {
    private _speed: number = 64;
    private readonly _gridCenter: Vector2 = new Vector2();
    private _gridCellHeight: number = 16;
    private _gridCellWidth: number = 16;
    private _collideTilemap: CssCollideTilemapRenderer|CssCollideTilemapChunkRenderer|null = null;
    private readonly _currentGridPosition: Vector2 = new Vector2();
    private readonly _targetGridPosition: Vector2 = new Vector2();
    private _isMoving: boolean = false;
    private readonly collideSize: number = 16;

    protected start(): void {
        const worldPosition = this.gameObject.localToWorld(this.gameObject.position);
        this._currentGridPosition.set(worldPosition.x, worldPosition.y);
    }

    public update(): void {
        this.processInput();
        this.processMovement();
    }

    private processInput(): void {
        if (this._isMoving) return;
        if (this.gameManager.inputHandler.map.get("w")) {
            if (this.checkCollision(this._currentGridPosition.x, this._currentGridPosition.y + this._gridCellHeight)) return;
            this._targetGridPosition.set(this._currentGridPosition.x, this._currentGridPosition.y + this._gridCellHeight);
            this.direction = Direction.Up;
            this._isMoving = true;
        } else if (this.gameManager.inputHandler.map.get("s")) {
            if (this.checkCollision(this._currentGridPosition.x, this._currentGridPosition.y - this._gridCellHeight)) return;
            this._targetGridPosition.set(this._currentGridPosition.x, this._currentGridPosition.y - this._gridCellHeight);
            this.direction = Direction.Down;
            this._isMoving = true;
        } else if (this.gameManager.inputHandler.map.get("a")) {
            if (this.checkCollision(this._currentGridPosition.x - this._gridCellWidth, this._currentGridPosition.y)) return;
            this._targetGridPosition.set(this._currentGridPosition.x - this._gridCellWidth, this._currentGridPosition.y);
            this.direction = Direction.Left;
            this._isMoving = true;
        } else if (this.gameManager.inputHandler.map.get("d")) {
            if (this.checkCollision(this._currentGridPosition.x + this._gridCellWidth, this._currentGridPosition.y)) return;
            this._targetGridPosition.set(this._currentGridPosition.x + this._gridCellWidth, this._currentGridPosition.y);
            this.direction = Direction.Right;
            this._isMoving = true;
        }
    }

    private noncheckProcessInput(currentGridPosotion: Vector2): boolean {
        if (this.gameManager.inputHandler.map.get("w")) {
            if (this.checkCollision(currentGridPosotion.x, currentGridPosotion.y + this._gridCellHeight)) return false;
            this._targetGridPosition.set(currentGridPosotion.x, currentGridPosotion.y + this._gridCellHeight);
            this.direction = Direction.Up;
            return true;
        } else if (this.gameManager.inputHandler.map.get("s")) {
            if (this.checkCollision(currentGridPosotion.x, currentGridPosotion.y - this._gridCellHeight)) return false;
            this._targetGridPosition.set(currentGridPosotion.x, currentGridPosotion.y - this._gridCellHeight);
            this.direction = Direction.Down;
            return true;
        } else if (this.gameManager.inputHandler.map.get("a")) {
            if (this.checkCollision(currentGridPosotion.x - this._gridCellWidth, currentGridPosotion.y)) return false;
            this._targetGridPosition.set(currentGridPosotion.x - this._gridCellWidth, currentGridPosotion.y);
            this.direction = Direction.Left;
            return true;
        } else if (this.gameManager.inputHandler.map.get("d")) {
            if (this.checkCollision(currentGridPosotion.x + this._gridCellWidth, currentGridPosotion.y)) return false;
            this._targetGridPosition.set(currentGridPosotion.x + this._gridCellWidth, currentGridPosotion.y);
            this.direction = Direction.Right;
            return true;
        }
        return false;
    }

    private processMovement(): void {
        if (this._isMoving) {
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
                this._isMoving = false;
                this._currentGridPosition.copy(this._targetGridPosition);
                this.direction = Direction.None;
            }
        }
    }

    private checkCollision(x: number, y: number): boolean {
        if (this._collideTilemap) {
            return this._collideTilemap.checkCollision(x, y, this.collideSize, this.collideSize);
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
        return this._gridCenter;
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

    public set collideTilemap(value: CssCollideTilemapRenderer|CssCollideTilemapChunkRenderer|null) {
        this._collideTilemap = value;
    }

    public get collideTilemap(): CssCollideTilemapRenderer|CssCollideTilemapChunkRenderer|null {
        return this._collideTilemap;
    }
}
