import { Vector2, Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { IGridCollideable } from "./IGridColideable";

export class GridCollideMap extends Component implements IGridCollideable {
    private readonly _collideMap: Map<`${number}_${number}`, boolean> = new Map();
    private _tileWidth: number = 16;
    private _tileHeight: number = 16;
    
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

        if (this.columnCount % 2 === 0) {
            x -= this.gridCellWidth;
        }
        if (this.rowCount % 2 === 0) {
            y -= this.gridCellHeight;
        }
        
        if (this.rowCount % 2 === 0) y += this.gridCellHeight / 2;
        if (this.columnCount % 2 === 0)  x += this.gridCellWidth / 2;
        const left = Math.floor(x / this.gridCellWidth);
        const right = Math.floor((x + width) / this.gridCellWidth);
        const top = Math.floor(y / this.gridCellHeight);
        const bottom = Math.floor((y + height) / this.gridCellHeight);
        //console.log(left, right, top, bottom);
        for (let row = top; row <= bottom; row++) {
            for (let column = left; column <= right; column++) {
                //console.log(`${column}_${row}`);
                if (this._collideMap.get(`${column}_${row}`) === true) {
                    return true;
                }
            }
        }
        return false;
    }

    public get gridCellWidth(): number {
        return this._tileWidth;
    }

    public set gridCellWidth(value: number) {
        this._tileWidth = value;
    }

    public get gridCellHeight(): number {
        return this._tileHeight;
    }

    public set gridCellHeight(value: number) {
        this._tileHeight = value;
    }

    public get gridCenter(): Vector2 {
        const offsetX = this._chunkSize % 2 === 1 ? 0 : this._tileWidth / 2;
        const offsetY = this._chunkSize % 2 === 1 ? 0 : this._tileHeight / 2;
        return new Vector2(this.gameObject.position.x + offsetX, this.gameObject.position.y + offsetY);
    }

    public get gridCenterX(): number {
        const offsetX = this._chunkSize % 2 === 1 ? 0 : this._tileWidth / 2;
        return this.gameObject.position.x + offsetX;
    }

    public get gridCenterY(): number {
        const offsetY = this._chunkSize % 2 === 1 ? 0 : this._tileHeight / 2;
        return this.gameObject.position.y + offsetY;
    }
}
