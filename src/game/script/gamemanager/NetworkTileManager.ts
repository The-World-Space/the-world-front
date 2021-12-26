import { Component } from "../../engine/hierarchy_object/Component";
import { CssTilemapChunkRenderer } from "../post_render/CssTilemapChunkRenderer";

export class NetworkTileManager extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _floorTileMap: CssTilemapChunkRenderer|null = null;
    private _effectTileMap: CssTilemapChunkRenderer|null = null;

    protected awake(): void {
        if (!this._floorTileMap) throw new Error("floor tilemap not set");
        if (!this._effectTileMap) throw new Error("effect tilemap not set");
    }

    public set floorTileMap(value: CssTilemapChunkRenderer|null) {
        this._floorTileMap = value;
    }

    public set effectTileMap(value: CssTilemapChunkRenderer|null) {
        this._effectTileMap = value;
    }
}
