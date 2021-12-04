import { Vector2, Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { IGridCollideable } from "./IGridColideable";

export class GridCollideMap extends Component implements IGridCollideable {
    private readonly _collideMap: Map<`${number}_${number}`, boolean> = new Map();
    private _gridCellWidth: number = 16;
    private _gridCellHeight: number = 16;
    
    private _initializeFunctions: ((() => void))[] = [];

    protected start(): void {
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }

    public addCollider(x: number, y: number): void {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.addCollider(x, y);
            });
            return;
        }
        this._collideMap.set(`${x}_${y}`, true);
    }

    public addColiderFromTwoDimensionalArray(array: (1|0)[][], xOffset: number, yOffset: number): void {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.addColiderFromTwoDimensionalArray(array, xOffset, yOffset);
            });
            return;
        }
        
        for (let y = 0; y < array.length; y++) {
            for (let x = 0; x < array[y].length; x++) {
                if (array[y][x] === 1) {
                    this.addCollider(x + xOffset, y + yOffset);
                }
            }
        }
    }
    
    private _tempVector3 = new Vector3();

    public checkCollision(x: number, y: number, width: number, height: number): boolean {
        this._tempVector3.copy(this.gameObject.position);
        const worldPosition = this.gameObject.localToWorld(this._tempVector3);
        x -= worldPosition.x / 2;
        y -= worldPosition.y / 2;
        
        const left = Math.floor(x / this.gridCellWidth);
        const right = Math.floor((x + width) / this.gridCellWidth);
        const top = Math.floor(y / this.gridCellHeight);
        const bottom = Math.floor((y + height) / this.gridCellHeight);
        
        for (let row = top; row <= bottom; row++) {
            for (let column = left; column <= right; column++) {
                if (this._collideMap.get(`${column}_${row}`) === true) {
                    return true;
                }
            }
        }
        return false;
    }

    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }

    public set gridCellWidth(value: number) {
        this._gridCellWidth = value;
    }

    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    public set gridCellHeight(value: number) {
        this._gridCellHeight = value;
    }

    public get gridCenter(): Vector2 {
        this._tempVector3.copy(this.gameObject.position);
        const worldPosition = this.gameObject.localToWorld(this._tempVector3);
        return new Vector2(worldPosition.x, worldPosition.y);
    }

    public get gridCenterX(): number {
        this._tempVector3.copy(this.gameObject.position);
        const worldPosition = this.gameObject.localToWorld(this._tempVector3);
        return worldPosition.x;
    }

    public get gridCenterY(): number {
        this._tempVector3.copy(this.gameObject.position);
        const worldPosition = this.gameObject.localToWorld(this._tempVector3);
        return worldPosition.y;
    }
}
