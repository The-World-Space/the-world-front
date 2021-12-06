import { Component } from "../../engine/hierarchy_object/Component";
import { CssCollideTilemapChunkRenderer } from "../physics/CssCollideTilemapChunkRenderer";
import { GridPointer } from "./GridPointer";
import { PointerGridEvent } from "./PointerGridInputListener";

export class TestTileBrush extends Component {
    private _gridPointer: GridPointer|null = null;
    private _colideTilemapChunk: CssCollideTilemapChunkRenderer|null = null;
    private _pointerDown: boolean = false;

    protected start(): void {
        if (!this._gridPointer) {
            throw new Error("TestTileBrush: gridPointer is not set");
        }

        if (!this._colideTilemapChunk) {
            throw new Error("TestTileBrush: colideTilemapChunk is not set");
        }

        this._gridPointer.addOnPointerDownEventListener(this.onPointerDown.bind(this));
        this._gridPointer.addOnPointerUpEventListener(this.onPointerUp.bind(this));
        this._gridPointer.addOnPointerMoveEventListener(this.onPointerMove.bind(this));
    }

    public destroy(): void {
        if (this._gridPointer) {
            this._gridPointer.removeOnPointerDownEventListener(this.onPointerDown.bind(this));
            this._gridPointer.removeOnPointerUpEventListener(this.onPointerUp.bind(this));
            this._gridPointer.removeOnPointerMoveEventListener(this.onPointerMove.bind(this));
        }
    }

    private onPointerDown(event: PointerGridEvent) {
        this._pointerDown = true;
        this._colideTilemapChunk!.drawTile(event.gridPosition.x, event.gridPosition.y, 0, 10);
    }

    private onPointerUp(_: PointerGridEvent) {
        this._pointerDown = false;
    }

    private onPointerMove(event: PointerGridEvent) {
        if (this._pointerDown) {
            this._colideTilemapChunk!.drawTile(event.gridPosition.x, event.gridPosition.y, 0, 10);
        }
    }

    get gridPointer(): GridPointer|null {
        return this._gridPointer;
    }

    set gridPointer(value: GridPointer|null) {
        this._gridPointer = value;
    }

    get colideTilemapChunk(): CssCollideTilemapChunkRenderer|null {
        return this._colideTilemapChunk;
    }

    set colideTilemapChunk(value: CssCollideTilemapChunkRenderer|null) {
        this._colideTilemapChunk = value;
    }
}
