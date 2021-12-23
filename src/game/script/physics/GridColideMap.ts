import { Vector2, Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { IGridCollidable } from "./IGridCollidable";

export class GridCollideMap extends Component implements IGridCollidable {
    private readonly _collideMap: Map<`${number}_${number}`, boolean> = new Map();
    private _gridCellWidth: number = 16;
    private _gridCellHeight: number = 16;
    private _showCollider: boolean = false;
    private _colliderImages: GameObject[] = [];
    
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
        if (this._showCollider) {
            this.addDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        }
    }

    public addColliderFromTwoDimensionalArray(array: (1|0)[][], xOffset: number, yOffset: number): void {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.addColliderFromTwoDimensionalArray(array, xOffset, yOffset);
            });
            return;
        }
        
        for (let y = 0; y < array.length; y++) {
            for (let x = 0; x < array[y].length; x++) {
                if (array[y][x] === 1) {
                    this.addCollider(x + xOffset, array.length - (y + yOffset));
                }
            }
        }
    }

    private addColliderImages() {
        this._collideMap.forEach((value, key) => {
            const [x, y] = key.split("_").map(Number);
            this.addDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        });
    }

    private removeColliderImages() {
        this._colliderImages.forEach(image => {
            image.destroy();
        });
        this._colliderImages = [];
    }
    
    private addDebugImage(x: number, y: number) {
        const gameObjectRef: {ref: GameObject|null} = {ref: null};
        this.gameObject.addChildFromBuilder(
            this.engine.instantlater.buildGameObject(
                "debugImage", new Vector3(x, y, 10000))
                .withComponent(ZaxisInitializer)
                .withComponent(CssSpriteRenderer, c => c.opacity = 0.5)
                .getGameObject(gameObjectRef));
        this._colliderImages.push(gameObjectRef.ref!);
    }
    
    private readonly _tempVector3 = new Vector3();

    public checkCollision(x: number, y: number, width: number, height: number): boolean {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        x -= worldPosition.x;
        y -= worldPosition.y;
        
        const left = Math.floor(x / this.gridCellWidth);
        const right = Math.floor((x + width) / this.gridCellWidth);
        const top = Math.floor(y / this.gridCellHeight);
        const bottom = Math.floor((y + height) / this.gridCellHeight);
        
        for (let y = top; y <= bottom; y++) {
            for (let x = left; x <= right; x++) {
                if (this._collideMap.get(`${x}_${y}`)) { //note: intended memory leak
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

    public get showCollider(): boolean {
        return this._showCollider;
    }

    public set showCollider(value: boolean) {
        this._showCollider = value;
        if (this._showCollider) {
            this.addColliderImages();
        } else {
            this.removeColliderImages();
        }
    }

    public get gridCenter(): Vector2 {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return new Vector2(worldPosition.x, worldPosition.y);
    }

    public get gridCenterX(): number {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return worldPosition.x;
    }

    public get gridCenterY(): number {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return worldPosition.y;
    }
}
