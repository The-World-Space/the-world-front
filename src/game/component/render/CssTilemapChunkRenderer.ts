import { Vector2 } from "three";
import { Component } from "../../engine/hierarchyObject/Component";
import { CssTilemapRenderer } from "./CssTilemapRenderer";

export class CssTilemapChunkRenderer extends Component {
    private _cssTilemapRendererMap: Map<Vector2, CssTilemapRenderer> = new Map();
    private _chunkSize: number = 16;
    
    protected start(): void {
        
    }

    public get chunkSize(): number {
        return this._chunkSize;
    }

    public set chunkSize(value: number) {
        this._chunkSize = value;
    }
}
