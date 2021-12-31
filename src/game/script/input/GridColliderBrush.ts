import { Component } from "../../engine/hierarchy_object/Component";
import { GridCollideMap } from "../../engine/script/physics/GridColideMap";
import { GridPointer } from "../../engine/script/input/GridPointer";
import { PointerGridEvent } from "../../engine/script/input/PointerGridInputListener";

export enum BrushMode {
    Draw,
    Erase
}

export class GridColliderBrush extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    
    private _gridPointer: GridPointer|null = null;
    private _colideMap: GridCollideMap|null = null;
    private _pointerDown: boolean = false;
    private _brushMode: BrushMode = BrushMode.Draw;

    private readonly _onPointerDownBind = this.onPointerDown.bind(this);
    private readonly _onPointerUpBind = this.onPointerUp.bind(this);
    private readonly _onPointerMoveBind = this.onPointerMove.bind(this);

    protected start(): void {
        if (!this._colideMap) throw new Error("ColliderBrush: colideMap is not set");
    }

    public onEnable(): void {
        if (!this._gridPointer) throw new Error("ColliderBrush: gridPointer is not set");
        this._gridPointer.addOnPointerDownEventListener(this._onPointerDownBind);
        this._gridPointer.addOnPointerUpEventListener(this._onPointerUpBind);
        this._gridPointer.addOnPointerMoveEventListener(this._onPointerMoveBind);
    }

    public onDisable(): void {
        if (this._gridPointer) {
            this._gridPointer.removeOnPointerDownEventListener(this._onPointerDownBind);
            this._gridPointer.removeOnPointerUpEventListener(this._onPointerUpBind);
            this._gridPointer.removeOnPointerMoveEventListener(this._onPointerMoveBind);
        }
    }

    private onPointerDown(event: PointerGridEvent) {
        this._pointerDown = true;
        if (this._brushMode === BrushMode.Draw) {
            this._colideMap!.addCollider(event.gridPosition.x, event.gridPosition.y);
        } else if (this._brushMode === BrushMode.Erase) {
            this._colideMap!.removeCollider(event.gridPosition.x, event.gridPosition.y);
        }
    }

    private onPointerUp() {
        this._pointerDown = false;
    }

    private onPointerMove(event: PointerGridEvent) {
        if (this._pointerDown) {
            if (this._brushMode === BrushMode.Draw) {
                this._colideMap!.addCollider(event.gridPosition.x, event.gridPosition.y);
            } else if (this._brushMode === BrushMode.Erase) {
                this._colideMap!.removeCollider(event.gridPosition.x, event.gridPosition.y);
            }
        }
    }

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
