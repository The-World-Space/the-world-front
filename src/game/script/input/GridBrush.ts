import { Vector2 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { GridPointer } from "./GridPointer";
import { PointerGridEvent } from "./PointerGridInputListener";

export class GridBrush extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    
    private _gridPointer: GridPointer|null = null;
    private _pointerDown: boolean = false;
    private _onDraw: (gridPosition: Vector2) => void = () => {};

    private readonly _onPointerDownBind = this.onPointerDown.bind(this);
    private readonly _onPointerUpBind = this.onPointerUp.bind(this);
    private readonly _onPointerMoveBind = this.onPointerMove.bind(this);

    public onEnable(): void {
        if (!this._gridPointer) throw new Error("GridBrush: gridPointer is not set");
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

    private readonly _lastGridPosition = new Vector2();

    private onPointerDown(event: PointerGridEvent) {
        this._pointerDown = true;
        this._lastGridPosition.copy(event.gridPosition);
    }

    private onPointerUp() {
        this._pointerDown = false;
    }

    private onPointerMove(event: PointerGridEvent) {
        if (!this._pointerDown) return;
        if (this._lastGridPosition.equals(event.gridPosition)) return;
    }

    public get gridPointer(): GridPointer|null {
        return this._gridPointer;
    }

    public set gridPointer(value: GridPointer|null) {
        this._gridPointer = value;
    }

    public get onDraw(): (gridPosition: Vector2) => void {
        return this._onDraw;
    }

    public set onDraw(value: (gridPosition: Vector2) => void) {
        this._onDraw = value;
    }
}
