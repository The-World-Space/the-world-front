import { Server } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { TileNetworker } from "../networker/TileNetworker";
import { CssTilemapChunkRenderer } from "../post_render/CssTilemapChunkRenderer";
import { TileAtlasItem } from "../render/CssTilemapRenderer";

export class NetworkTileManager extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _floorTileMap: CssTilemapChunkRenderer|null = null;
    private _effectTileMap: CssTilemapChunkRenderer|null = null;
    private _atlasImageMap: Map<string, number> = new Map();
    private _atlasImageAddIndex: number = 0;
    private _initTileList: Server.AtlasTile[] = [];
    private _tileNetworker: TileNetworker | null = null;

    private _atlasItemList: TileAtlasItem[] = [];

    public set initTileList(value: Server.AtlasTile[]) {
        this._initTileList = [...value];
    }

    public set tileNetworker(value: TileNetworker|null) {
        this._tileNetworker = value;
    }

    protected awake(): void {
        if (!this._floorTileMap) throw new Error("floor tilemap not set");
        if (!this._effectTileMap) throw new Error("effect tilemap not set");
        if (!this._tileNetworker) throw new Error("tile networker not set");

        const tileSrcMap = new Map<string, Server.Atlas>();
        this._initTileList.map(tile => {
            if (tileSrcMap.has(tile.atlas.src)) return;
            tileSrcMap.set(tile.atlas.src, tile.atlas);
        });
        
        const promiseList: Promise<void>[] = [];
        tileSrcMap.forEach((atlas, src) => {
            this._atlasImageMap.set(src, this._atlasImageAddIndex);
            const image = new Image();
            image.src = src;
            const atlasItem = new TileAtlasItem(image, atlas.columnCount, atlas.rowCount);
            this._atlasItemList.push(atlasItem);
            promiseList.push(imageLoad(image));
            this._atlasImageAddIndex += 1;
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

        Promise.all(promiseList).then(() => {
            this._initTileList.map(tile => {
                if (tile.type === Server.TileType.Floor) {
                    this._floorTileMap!.drawTile(tile.x, tile.y, this._atlasImageMap.get(tile.atlas.src)!, tile.atlasIndex);
                } else {
                    this._effectTileMap!.drawTile(tile.x, tile.y, this._atlasImageMap.get(tile.atlas.src)!, tile.atlasIndex);
                }
            });
    
            this._initTileList = [];
        });
        
        this._floorTileMap.imageSources = this._atlasItemList;
        this._effectTileMap.imageSources = this._atlasItemList;

        this._tileNetworker.ee.on("create", data => {
            this.drawTile(data);
        });

        this._tileNetworker.ee.on("delete", (x, y, type) => {
            if (type === Server.TileType.Floor)
                this._floorTileMap!.clearTile(x, y);
            if (type === Server.TileType.Effect)
                this._effectTileMap!.clearTile(x, y);
        });

        this._tileNetworker.ee.on("update", data => {
            this._floorTileMap!.clearTile(data.x, data.y);
            this.drawTile(data);
        });
    }

    //you must not call this function in initialization(performance issue)
    private drawTile(atlasTile: Server.AtlasTile): void {
        let imageIndex = this._atlasImageMap.get(atlasTile.atlas.src);
        if (imageIndex === undefined) {
            this._atlasImageMap.set(atlasTile.atlas.src, this._atlasImageAddIndex);
            this._atlasImageAddIndex += 1;
            const image = new Image();
            image.src = atlasTile.atlas.src;
            const atlasItem = new TileAtlasItem(image, atlasTile.atlas.columnCount, atlasTile.atlas.rowCount);
            this._atlasItemList.push(atlasItem);
            imageIndex = this._atlasImageAddIndex - 1;
            image.onload = () => {
                if (atlasTile.type === Server.TileType.Floor) {
                    this._floorTileMap!.drawTile(atlasTile.x, atlasTile.y, imageIndex!, atlasTile.atlasIndex);
                } else {
                    this._effectTileMap!.drawTile(atlasTile.x, atlasTile.y, imageIndex!, atlasTile.atlasIndex);
                }
            };
        } else {
            if (atlasTile.type === Server.TileType.Floor) {
                this._floorTileMap!.drawTile(atlasTile.x, atlasTile.y, imageIndex, atlasTile.atlasIndex);
            } else {
                this._effectTileMap!.drawTile(atlasTile.x, atlasTile.y, imageIndex, atlasTile.atlasIndex);
            }
        }
    }

    public set floorTileMap(value: CssTilemapChunkRenderer|null) {
        this._floorTileMap = value;
    }

    public set effectTileMap(value: CssTilemapChunkRenderer|null) {
        this._effectTileMap = value;
    }
}
