import { Vector2, Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { CssCollideTilemapRenderer } from "../physics/CssCollideTilemapRenderer";
import { TileAtlasItem } from "../render/CssTilemapRenderer";

export class CssCollideTilemapChunkRenderer extends Component {
    private readonly _cssTilemapRendererMap: Map<`${number}_${number}`, CssCollideTilemapRenderer> = new Map();
    //key is chunk position in string format "x_y"
    private _chunkSize: number = 16;
    private _tileWidth: number = 16;
    private _tileHeight: number = 16;
    private _imageSources: TileAtlasItem[]|null = null;
    
    private _initializeFunctions: ((() => void))[] = [];

    protected start(): void {
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }

    private updateTilemapPosition() {
        this._cssTilemapRendererMap.forEach((renderer, key) => {
            const chunkIndexX = this.getIndexXFromKey(key) * this._chunkSize * this._tileWidth;
            const chunkIndexY = this.getIndexYFromKey(key) * this._chunkSize * this._tileHeight;
            renderer.gameObject.position.set(chunkIndexX, chunkIndexY, 0);
        });
    }

    private getIndexXFromKey(key: string): number {
        return parseInt(key.substring(0, key.indexOf("_")));
    }

    private getIndexYFromKey(key: string): number {
        return parseInt(key.substring(key.indexOf("_") + 1));
    }

    private getKeyFromIndex(x: number, y: number): `${number}_${number}` {
        return `${x}_${y}`;
    }

    private computeDrawPosition(chunkIndexX: number, chunkIndexY: number, x: number, y: number): Vector2 {
        //get relative position in chunk
        //note: 0,0 is center of chunk
        const relativeX = (x - chunkIndexX * this._chunkSize) + this._chunkSize / 2;
        const relativeY = (y - chunkIndexY * this._chunkSize) + this._chunkSize / 2;

        return new Vector2(relativeX, relativeY);
    }

    public drawTile(x: number, y: number, imageIndex: number, atlasIndex?: number): void {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.drawTile(x, y, imageIndex, atlasIndex);
            });
            return;
        }

        const chunkIndexX = Math.floor((x + this._chunkSize / 2) / this._chunkSize);
        const chunkIndexY = Math.floor((y + this._chunkSize / 2) / this._chunkSize);
        const chunkIndex = this.getKeyFromIndex(chunkIndexX, chunkIndexY);
        let cssTilemapRenderer = this._cssTilemapRendererMap.get(chunkIndex);
        if (cssTilemapRenderer === undefined) {
            this.gameObject.addChildFromBuilder(
                this.gameManager.instantlater.buildGameObject(
                    `css_tilemap_renderer_${chunkIndexX}_${chunkIndexY}`, 
                    new Vector3(chunkIndexX * this._chunkSize * this._tileWidth, chunkIndexY * this._chunkSize * this._tileHeight, 0))
                    .withComponent(CssCollideTilemapRenderer, c => {
                        cssTilemapRenderer = c;
                        if (this._imageSources) c.imageSources = this._imageSources;
                        c.tileWidth = this._tileWidth;
                        c.tileHeight = this._tileHeight;
                        c.rowCount = this._chunkSize;
                        c.columnCount = this._chunkSize;
                    })
            );
            this._cssTilemapRendererMap.set(chunkIndex, cssTilemapRenderer!);
        }
        const drawPosition = this.computeDrawPosition(chunkIndexX, chunkIndexY, x, y);
        cssTilemapRenderer!.drawTile(drawPosition.x, this._chunkSize - drawPosition.y - 1, imageIndex, atlasIndex);
    }

    public get chunkSize(): number {
        return this._chunkSize;
    }

    public set chunkSize(value: number) {
        this._chunkSize = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.rowCount = this._chunkSize;
            renderer.columnCount = this._chunkSize;
        });
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

    public get tileWidth(): number {
        return this._tileWidth;
    }

    public set tileWidth(value: number) {
        if (this._tileWidth === value) return;
        this._tileWidth = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.tileWidth = this._tileWidth;
        });
    }

    public get tileHeight(): number {
        return this._tileHeight;
    }

    public set tileHeight(value: number) {
        if (this._tileHeight === value) return;
        this._tileHeight = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.tileHeight = this._tileHeight;
        });
    }
}
