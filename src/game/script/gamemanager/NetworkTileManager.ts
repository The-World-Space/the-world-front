import { Server } from "../../connect/types";
import { AsyncImageLoader, Component, CssTilemapChunkRenderer, TileAtlasItem } from "the-world-engine";
import { TileNetworker } from "../networker/TileNetworker";

export class NetworkTileManager extends Component {
    public readonly disallowMultipleComponent: boolean = true;

    private _floorTileMap: CssTilemapChunkRenderer|null = null;
    private _effectTileMap: CssTilemapChunkRenderer|null = null;
    private _atlasImageMap: Map<string, number> = new Map();
    private _atlasImageAddIndex: number = 0;
    private _initTileList: Server.AtlasInfoScalar = [];
    private _tileNetworker: TileNetworker | null = null;

    private _atlasItemList: TileAtlasItem[] = [];

    public set initTileList(value: Server.AtlasInfoScalar) {
        this._initTileList = value;
    }

    public set tileNetworker(value: TileNetworker|null) {
        this._tileNetworker = value;
    }

    protected awake(): void {
        if (!this._floorTileMap) throw new Error("floor tilemap not set");
        if (!this._effectTileMap) throw new Error("effect tilemap not set");
        if (!this._tileNetworker) throw new Error("tile networker not set");

        const ImageList: HTMLImageElement[] = [];
        for (let i = 0; i < this._initTileList.length; i++) {
            const atlas = this._initTileList[i];
            this._atlasImageMap.set(atlas.src, this._atlasImageAddIndex);
            const image = new Image();
            image.src = atlas.src;
            ImageList.push(image);
            this._atlasImageAddIndex += 1;
        }

        AsyncImageLoader.loadImages(ImageList).then(images => {
            for (let i = 0; i < images.length; ++i) {
                const image = images[i];
                const atlas = this._initTileList[i];
                const atlasItem = new TileAtlasItem(image, atlas.columnCount, atlas.rowCount);
                this._atlasItemList.push(atlasItem);
            }

            this._floorTileMap!.imageSources = this._atlasItemList;
            this._effectTileMap!.imageSources = this._atlasItemList;

            for (let i = 0; i < this._initTileList.length; i++) {
                const atlas = this._initTileList[i];
                for (let j = 0; j < atlas.tiles.length; j++) {
                    const tile = atlas.tiles[j];
                    if (tile.type === Server.TileType.Floor) {
                        this._floorTileMap!.drawTile(tile.x, tile.y, i, tile.atlasIndex);
                    } else if (tile.type === Server.TileType.Effect) {
                        this._effectTileMap!.drawTile(tile.x, tile.y, i, tile.atlasIndex);
                    }
                }
            }
            this._initTileList = [];
        });

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
            AsyncImageLoader.loadImageFromPath(atlasTile.atlas.src).then(image => {
                const atlasItem = new TileAtlasItem(image, atlasTile.atlas.columnCount, atlasTile.atlas.rowCount);
                this._atlasItemList.push(atlasItem);
                imageIndex = this._atlasImageAddIndex - 1;
                if (atlasTile.type === Server.TileType.Floor) {
                    this._floorTileMap!.drawTile(atlasTile.x, atlasTile.y, imageIndex!, atlasTile.atlasIndex);
                } else {
                    this._effectTileMap!.drawTile(atlasTile.x, atlasTile.y, imageIndex!, atlasTile.atlasIndex);
                }
            });
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
