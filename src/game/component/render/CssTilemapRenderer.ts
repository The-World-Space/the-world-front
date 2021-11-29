import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchyObject/Component";

export class CssTilemapRenderer extends Component{
    protected readonly _disallowMultipleComponent: boolean = true;

    private _columnCount: number = 10;
    private _rowCount: number = 10;
    private _tileWidth: number = 16;
    private _tileHeight: number = 16;
    private _sprite: CSS3DObject|null = null;
    private _htmlCanvasElement: HTMLCanvasElement|null = null;
    private _imageSources: HTMLImageElement[]|null = null;

    protected start(): void { 
        this.drawTileMap();
    }

    public onDestroy(): void {
        if (this._sprite) this._gameObject.remove(this._sprite);
    }

    private drawTileMap(): void {
        const tileMapWidth: number = this._columnCount * this._tileWidth;
        const tileMapHeight: number = this._rowCount * this._tileHeight;
        this._htmlCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
        this._htmlCanvasElement.width = tileMapWidth;
        this._htmlCanvasElement.height = tileMapHeight;
        this._sprite = new CSS3DObject(this._htmlCanvasElement);
        this._gameObject.add(this._sprite);
    }

    public drawTile(column: number, row: number, imageIndex: number): void {
        const context: CanvasRenderingContext2D = this._htmlCanvasElement!.getContext("2d")!;
        const imageSource: HTMLImageElement = this._imageSources![imageIndex];
        context.drawImage(imageSource, column * this._tileWidth, row * this._tileHeight);
    }

    public set imageSources(value: HTMLImageElement[]) {
        this._imageSources = value;
    }

    public get columnCount(): number {
        return this._columnCount;
    }

    public get rowCount(): number {
        return this._rowCount;
    }
}
