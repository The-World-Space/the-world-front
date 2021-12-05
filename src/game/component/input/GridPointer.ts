import { Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { ComponentConstructor } from "../../engine/hierarchy_object/ComponentConstructor";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";
import { PointerGridEvent, PointerGridInputListener } from "./PointerGridInputListener";

export class GridPointer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [PointerGridInputListener];

    private _pointerGridInputListener: PointerGridInputListener|null = null;
    private _pointerZoffset: number = 0;
    private _pointerObject: GameObject|null = null;
    private _onPointerDownDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onPointerUpDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onPointerMoveDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _isMouseDown: boolean = false;

    protected start(): void {
        this._pointerGridInputListener = this.gameObject.getComponent(PointerGridInputListener);
        this._pointerGridInputListener!.addOnMouseEnterEventListener(this.onMouseEnter.bind(this));
        this._pointerGridInputListener!.addOnMouseLeaveEventListener(this.onMouseLeave.bind(this));
        this._pointerGridInputListener!.addOnMouseDownEventListener(this.onMouseDown.bind(this));
        this._pointerGridInputListener!.addOnMouseUpEventListener(this.onMouseUp.bind(this));
        this._pointerGridInputListener!.addOnMouseMoveEventListener(this.onMouseMove.bind(this));

        const pointerObject: {ref: GameObject|null} = {ref: null};
        this.gameObject.addChildFromBuilder(
            this.gameManager.instantlater.buildGameObject("pointer", new Vector3(0, 0, this._pointerZoffset))
                .active(false)
                .withComponent(CssHtmlElementRenderer, c => {
                    c.pointerEvents = false;
                    const cursorElement = document.createElement("div");
                    cursorElement.style.backgroundColor = "white";
                    cursorElement.style.opacity = "0.3";
                    c.setElement(cursorElement);
                })
                .getGameObject(pointerObject));
        this._pointerObject = pointerObject.ref;
    }

    public onDestroy(): void {
        if (this._pointerGridInputListener) {
            this._pointerGridInputListener.removeOnMouseEnterEventListener(this.onMouseEnter.bind(this));
            this._pointerGridInputListener.removeOnMouseLeaveEventListener(this.onMouseLeave.bind(this));
            this._pointerGridInputListener.removeOnMouseDownEventListener(this.onMouseDown.bind(this));
            this._pointerGridInputListener.removeOnMouseUpEventListener(this.onMouseUp.bind(this));
            this._pointerGridInputListener.removeOnMouseMoveEventListener(this.onMouseMove.bind(this));
        }
    }

    private onMouseEnter(event: PointerGridEvent): void {
        this._pointerObject!.activeSelf = true;
        this.onMouseMove(event);
    }

    private onMouseLeave(event: PointerGridEvent): void {
        if (this._isMouseDown) this.onMouseUp(event);
        this._pointerObject!.activeSelf = false;
    }

    private onMouseDown(event: PointerGridEvent): void {
        this._isMouseDown = true;
        this._onPointerDownDelegates.forEach(delegate => delegate(event));
    }

    private onMouseUp(event: PointerGridEvent): void {
        this._isMouseDown = false;
        this._onPointerUpDelegates.forEach(delegate => delegate(event));
    }

    private onMouseMove(event: PointerGridEvent): void {
        const gridCellWidth = this._pointerGridInputListener!.gridCellWidth;
        const gridCellHeight = this._pointerGridInputListener!.gridCellHeight;
        const positionX = event.gridPosition.x * gridCellWidth;
        const positionY = event.gridPosition.y * gridCellHeight;
        this._pointerObject!.position.set(positionX, positionY, this._pointerZoffset);

        this._onPointerMoveDelegates.forEach(delegate => delegate(event));
    }

    public addOnPointerDownEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerDownDelegates.push(delegate);
    }

    public removeOnPointerDownEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerDownDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerDownDelegates.splice(index, 1);
    }

    public addOnPointerUpEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerUpDelegates.push(delegate);
    }

    public removeOnPointerUpEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerUpDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerUpDelegates.splice(index, 1);
    }

    public addOnPointerMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerMoveDelegates.push(delegate);
    }

    public removeOnPointerMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerMoveDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerMoveDelegates.splice(index, 1);
    }

    public get pointerZoffset(): number {
        return this._pointerZoffset;
    }

    public set pointerZoffset(value: number) {
        this._pointerZoffset = value;
    }
}
