import { Component, GridCollideMap, GridPointer, PointerGridEvent } from "the-world-engine";

export enum BrushMode {
    Draw,
    Erase
}

export class GridColliderBrush extends Component {
    public readonly disallowMultipleComponent: boolean = true;
    
    private _gridPointer: GridPointer|null = null;
    private _colideMap: GridCollideMap|null = null;
    private _pointerDown = false;
    private _brushMode: BrushMode = BrushMode.Draw;
    
    protected start(): void {
        if (!this._colideMap) throw new Error("ColliderBrush: colideMap is not set");
    }

    public onEnable(): void {
        if (!this._gridPointer) throw new Error("ColliderBrush: gridPointer is not set");
        this._gridPointer.onPointerDown.addListener(this.onPointerDown);
        this._gridPointer.onPointerUp.addListener(this.onPointerUp);
        this._gridPointer.onPointerMove.addListener(this.onPointerMove);
    }

    public onDisable(): void {
        if (this._gridPointer) {
            this._gridPointer.onPointerDown.removeListener(this.onPointerDown);
            this._gridPointer.onPointerUp.removeListener(this.onPointerUp);
            this._gridPointer.onPointerMove.removeListener(this.onPointerMove);
        }
    }

    private readonly onPointerDown = (event: PointerGridEvent): void => {
        this._pointerDown = true;
        if (this._brushMode === BrushMode.Draw) {
            this._colideMap!.addCollider(event.gridPosition.x, event.gridPosition.y);
        } else if (this._brushMode === BrushMode.Erase) {
            this._colideMap!.removeCollider(event.gridPosition.x, event.gridPosition.y);
        }
    };

    private readonly onPointerUp = (): void => {
        this._pointerDown = false;
    };

    private readonly onPointerMove = (event: PointerGridEvent): void => {
        if (this._pointerDown) {
            if (this._brushMode === BrushMode.Draw) {
                this._colideMap!.addCollider(event.gridPosition.x, event.gridPosition.y);
            } else if (this._brushMode === BrushMode.Erase) {
                this._colideMap!.removeCollider(event.gridPosition.x, event.gridPosition.y);
            }
        }
    };

    public get gridPointer(): GridPointer|null {
        return this._gridPointer;
    }

    public set gridPointer(value: GridPointer|null) {
        if (this._gridPointer) throw new Error("GridPointer is already set");
        this._gridPointer = value;
    }

    public get collideMap(): GridCollideMap|null {
        return this._colideMap;
    }

    public set collideMap(value: GridCollideMap|null) {
        this._colideMap = value;
    }

    public get brushMode(): BrushMode {
        return this._brushMode;
    }

    public set brushMode(value: BrushMode) {
        this._brushMode = value;
    }
}
