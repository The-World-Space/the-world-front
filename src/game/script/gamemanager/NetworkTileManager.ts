import { Server } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { CssTilemapChunkRenderer } from "../post_render/CssTilemapChunkRenderer";

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

        const tileSrcMap = new Set<string>();
        this._initTileList.map(tile => {
            tileSrcMap.add(tile.atlas.src);
        });

        this._initTileList = [];
    }

    public set floorTileMap(value: CssTilemapChunkRenderer|null) {
        this._floorTileMap = value;
    }

    public set effectTileMap(value: CssTilemapChunkRenderer|null) {
        this._effectTileMap = value;
    }
}
