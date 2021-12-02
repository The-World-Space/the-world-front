import { Vector2 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";

export class TileAtlasItem {
    private _htmlImageElement: HTMLImageElement;
    private _columnCount: number;
    private _rowCount: number;

    public constructor(htmlImageElement: HTMLImageElement);

    public constructor(htmlImageElement: HTMLImageElement, columnCount: number, rowCount: number);

    public constructor(htmlImageElement: HTMLImageElement, columnCount?: number, rowCount?: number) {
        this._htmlImageElement = htmlImageElement;
        this._rowCount = rowCount || 1;
        this._columnCount = columnCount || 1;
    }

    public get htmlImageElement(): HTMLImageElement {
        return this._htmlImageElement;
    }

    public get columnCount(): number {
        return this._columnCount;
    }

    public get rowCount(): number {
        return this._rowCount;
    }
}

export class CssTilemapRenderer extends Component{
    protected readonly _disallowMultipleComponent: boolean = true;

    private _columnCount: number = 10;
    private _rowCount: number = 10;
    private _tileWidth: number = 16;
    private _tileHeight: number = 16;
    private _sprite: CSS3DObject|null = null;
    private _htmlCanvasElement: HTMLCanvasElement|null = null;
    private _imageSources: TileAtlasItem[]|null = null;
    private _zindex: number = 0;
    
    private _initializeFunctions: ((() => void))[] = [];

    protected start(): void { 
        this.drawTileMap();

        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
    }

    public onDestroy(): void {
        if (this._sprite) this.gameObject.remove(this._sprite);
    }

    public onSortByZaxis(zaxis: number): void {
        this._zindex = zaxis;
        if (this._sprite) {
            this._sprite.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }

    private drawTileMap(): void {
        const tileMapWidth: number = this._columnCount * this._tileWidth;
        const tileMapHeight: number = this._rowCount * this._tileHeight;
        this._htmlCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
        this._htmlCanvasElement.style.imageRendering = "pixelated";
        this._htmlCanvasElement.style.zIndex = Math.floor(this._zindex).toString();
        this._htmlCanvasElement.width = tileMapWidth;
        this._htmlCanvasElement.height = tileMapHeight;
        this._sprite = new CSS3DObject(this._htmlCanvasElement);
        this.gameObject.add(this._sprite);
    }

    public drawTile(column: number, row: number, imageIndex: number, atlasIndex?: number): void {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.drawTile(column, row, imageIndex);
            });
            return;
        }

        const context: CanvasRenderingContext2D = this._htmlCanvasElement!.getContext("2d")!;
        const imageSource: TileAtlasItem = this._imageSources![imageIndex];
        if (imageSource.rowCount === 1 && imageSource.columnCount === 1) {
            context.drawImage(
                imageSource.htmlImageElement, 
                0, 0, this._tileWidth, this._tileHeight, 
                column * this._tileWidth, row * this._tileHeight,
                this._tileWidth, this._tileHeight);
        } else if (atlasIndex !== undefined) {   
            const rowIndex: number = Math.floor(atlasIndex / imageSource.columnCount);
            const columnIndex: number = atlasIndex % imageSource.columnCount;
            const imageWidth: number = imageSource.htmlImageElement.width / imageSource.columnCount;
            const imageHeight: number = imageSource.htmlImageElement.height / imageSource.rowCount;
            context.drawImage(
                imageSource.htmlImageElement, 
                columnIndex * imageWidth, rowIndex * imageHeight, 
                imageWidth, imageHeight, 
                column * this._tileWidth, row * this._tileHeight,
                this._tileWidth, this._tileHeight);
        } else {
            throw new Error("Atlas index is required.");
        }
    }

    //i is imageIndex and a is atlasIndex
    public drawTileFromTwoDimensionalArray(array: ({i: number, a: number}|null)[][], columnOffset: number, rowOffset: number): void {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.drawTileFromTwoDimensionalArray(array, columnOffset, rowOffset);
            });
            return;
        }

        const context: CanvasRenderingContext2D = this._htmlCanvasElement!.getContext("2d")!;
        for (let rowIndex: number = 0; rowIndex < array.length; rowIndex++) {
            const row: ({i: number, a: number}|null)[] = array[rowIndex];
            for (let columnIndex: number = 0; columnIndex < row.length; columnIndex++) {
                const tile: ({i: number, a: number}|null) = row[columnIndex];
                if (tile === null) continue;
                const imageSource: TileAtlasItem = this._imageSources![tile.i];
                if (imageSource.rowCount === 1 && imageSource.columnCount === 1) {
                    context.drawImage(
                        imageSource.htmlImageElement, 
                        0, 0, this._tileWidth, this._tileHeight, 
                        columnIndex * this._tileWidth + columnOffset * this._tileWidth, rowIndex * this._tileHeight + rowOffset * this._tileHeight,
                        this._tileWidth, this._tileHeight);
                } else if (tile.a !== undefined) {
                    const atlasColumnIndex: number = tile.a % imageSource.columnCount;
                    const atlasRowIndex: number = Math.floor(tile.a / imageSource.columnCount);
                    const imageWidth: number = imageSource.htmlImageElement.width / imageSource.columnCount;
                    const imageHeight: number = imageSource.htmlImageElement.height / imageSource.rowCount;
                    context.drawImage(
                        imageSource.htmlImageElement,
                        atlasColumnIndex * imageWidth, atlasRowIndex * imageHeight,
                        imageWidth, imageHeight,
                        columnIndex * this._tileWidth + columnOffset * this._tileWidth, rowIndex * this._tileHeight + rowOffset * this._tileHeight,
                        this._tileWidth, this._tileHeight);
                } else {
                    throw new Error("Atlas index is required.");
                }
            }
        }
    }

    public set imageSources(value: TileAtlasItem[]) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.imageSources = value;
            });
            return;
        }

        this._imageSources = value;
    }

    public get columnCount(): number {
        return this._columnCount;
    }

    public set columnCount(value: number) {
        this._columnCount = value;

        if (this._htmlCanvasElement) {
            this._htmlCanvasElement.width = this._columnCount * this._tileWidth;
        }
    }

    public get rowCount(): number {
        return this._rowCount;
    }

    public set rowCount(value: number) {
        this._rowCount = value;

        if (this._htmlCanvasElement) {
            this._htmlCanvasElement.height = this._rowCount * this._tileHeight;
        }
    }

    public get tileWidth(): number {
        return this._tileWidth;
    }

    public set tileWidth(value: number) {
        this._tileWidth = value;

        if (this._htmlCanvasElement) {
            this._htmlCanvasElement.width = this._columnCount * this._tileWidth;
        }
    }

    public get tileHeight(): number {
        return this._tileHeight;
    }

    public set tileHeight(value: number) {
        this._tileHeight = value;

        if (this._htmlCanvasElement) {
            this._htmlCanvasElement.height = this._rowCount * this._tileHeight;
        }
    }
    
    public get gridCenter(): Vector2 {
        const offsetX = this.columnCount % 2 === 1 ? 0 : this.tileWidth / 2;
        const offsetY = this.rowCount % 2 === 1 ? 0 : this.tileHeight / 2;
        return new Vector2(this.gameObject.position.x + offsetX, this.gameObject.position.y + offsetY);
    }

    public get gridCenterX(): number {
        return this.gameObject.position.x + (this.columnCount % 2 === 1 ? 0 : this.tileWidth / 2);
    }

    public get gridCenterY(): number {
        return this.gameObject.position.y + (this.rowCount % 2 === 1 ? 0 : this.tileHeight / 2);
    }
}
