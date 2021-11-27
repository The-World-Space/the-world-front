import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchyObject/Component";

export class CssTilemapRenderer extends Component{
    protected readonly _disallowMultipleComponent: boolean = true;

    // private _columnCount: number;
    // private _rowCount: number;
    // private _tileWidth: number;
    // private _tileHeight: number;

    private _sprite: CSS3DObject|null = null;

    protected start(): void { 

    }

    public onDestroy(): void {

    }

    private drawTileMap(): void {
        // const tileMapColumnCount = this.tileMapColumnCount;
        // const tileMapRowCount = tileMap.rowCount;
        // const tileWidth = tileMap.tileWidth;
        // const tileHeight = tileMap.tileHeight;

        // const sprite = new CSS3DObject(document.createElement("div"));
        // sprite.position.x = -tileWidth * (tileMapColumnCount / 2);
        // sprite.position.y = -tileHeight * (tileMapRowCount / 2);
        // sprite.position.z = 0;
        // sprite.scale.x = tileWidth;
        // sprite.scale.y = tileHeight;
        // sprite.scale.z = 1;

        // const tileMapElement = sprite.element as HTMLElement;
        // tileMapElement.style.width = `${tileMapColumnCount * tileWidth}px`;
        // tileMapElement.style.height = `${tileMapRowCount * tileHeight}px`;
        // tileMapElement.style.backgroundColor = "red";

        // this._columnCount = tileMapColumnCount;
        // this._rowCount = tileMapRowCount;
        // this._tileWidth = tileWidth;
        // this._tileHeight = tileHeight;

        // this._sprite = sprite;
    }

    // public get columnCount(): number {
    //     return this._columnCount;
    // }

    // public get rowCount(): number {
    //     return this._rowCount;
    // }
}