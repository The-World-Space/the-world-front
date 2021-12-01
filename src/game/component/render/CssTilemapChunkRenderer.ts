import { Vector2 } from "three";
import { Component } from "../../engine/hierarchyObject/Component";
import { CssTilemapRenderer, TileAtlasItem } from "./CssTilemapRenderer";

export class CssTilemapChunkRenderer extends Component {
    private _cssTilemapRendererMap: Map<Vector2, CssTilemapRenderer> = new Map();
    private _chunkSize: number = 16;
    private _imageSources: TileAtlasItem[]|null = null;
    
    private _initializeFunctions: ((() => void))[] = [];

    protected start(): void {
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }

    private updateTilemapPosition() {
        this._cssTilemapRendererMap.forEach(renderer => {
            renderer
        });
    }

    public drawTile(x: number, y: number, imageIndex: number, atlasIndex?: number): void {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.drawTile(x, y, imageIndex, atlasIndex);
            });
            return;
        }

        const chunkX = Math.floor(x / this._chunkSize);
        const chunkY = Math.floor(y / this._chunkSize);
        const chunkPosition = new Vector2(chunkX, chunkY);
        let cssTilemapRenderer = this._cssTilemapRendererMap.get(chunkPosition);
        if (cssTilemapRenderer === undefined) {
            this.gameObject.addChildFromBuilder(
                this.gameManager.instantlater.buildGameObject(`CssTilemapRenderer_${chunkX}_${chunkY}`)
                    .withComponent(CssTilemapRenderer, c => {
                        cssTilemapRenderer = c;
                        if (this._imageSources) c.imageSources = this._imageSources;
                        c.tileWidth = this._chunkSize;
                        c.tileHeight = this._chunkSize;
                    })
            );
            this._cssTilemapRendererMap.set(chunkPosition, cssTilemapRenderer!);
        }
        cssTilemapRenderer!.drawTile(x, y, imageIndex, atlasIndex);
    }

    public get chunkSize(): number {
        return this._chunkSize;
    }

    public set chunkSize(value: number) {
        this._chunkSize = value;
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
}
