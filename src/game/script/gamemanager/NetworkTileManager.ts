import { Server } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { CssTilemapChunkRenderer } from "../post_render/CssTilemapChunkRenderer";
import { TileAtlasItem } from "../render/CssTilemapRenderer";

export class NetworkTileManager extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _floorTileMap: CssTilemapChunkRenderer|null = null;
    private _effectTileMap: CssTilemapChunkRenderer|null = null;
    private _initTileList: Server.AtlasTile[] = [];

    public set initTileList(value: Server.AtlasTile[]) {
        this._initTileList = [...value];
    }

    protected awake(): void {
        if (!this._floorTileMap) throw new Error("floor tilemap not set");
        if (!this._effectTileMap) throw new Error("effect tilemap not set");

        const tileSrcMap = new Map<string, Server.Atlas>();
        this._initTileList.map(tile => {
            if (tileSrcMap.has(tile.atlas.src)) return;
            tileSrcMap.set(tile.atlas.src, tile.atlas);
        });

        function imageLoad(image: HTMLImageElement) {
            return new Promise<void>((res, rej) => {
                image.onload = () => {
                    res();
                };
                image.onerror = () => {
                    rej();
                };
            });
        }
        
        const atlasImageMap = new Map<string, number>();
        const atlasItemList: TileAtlasItem[] = [];
        const promiseList: Promise<void>[] = [];
        let index = 0;
        tileSrcMap.forEach((atlas, src) => {
            atlasImageMap.set(src, index);
            const image = new Image();
            image.src = src;
            const atlasItem = new TileAtlasItem(image, atlas.columnCount, atlas.rowCount);
            atlasItemList.push(atlasItem);
            promiseList.push(imageLoad(image));
            index++;
        });
        this._floorTileMap.imageSources = atlasItemList;
        this._effectTileMap.imageSources = atlasItemList;

        Promise.all(promiseList).then(() => {
            this._initTileList.map(tile => {
                if (tile.type === Server.TileType.Floor) {
                    this._floorTileMap!.drawTile(tile.x, tile.y, atlasImageMap.get(tile.atlas.src)!, tile.atlasIndex);
                } else {
                    this._effectTileMap!.drawTile(tile.x, tile.y, atlasImageMap.get(tile.atlas.src)!, tile.atlasIndex);
                }
            });
    
            this._initTileList = [];
        });
    }

    public set floorTileMap(value: CssTilemapChunkRenderer|null) {
        this._floorTileMap = value;
    }

    public set effectTileMap(value: CssTilemapChunkRenderer|null) {
        this._effectTileMap = value;
    }
}
