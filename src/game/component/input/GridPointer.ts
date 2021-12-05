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

    protected start(): void {
        this._pointerGridInputListener = this.gameObject.getComponent(PointerGridInputListener);
        this._pointerGridInputListener!.addOnMouseEnterEventListener(this.onMouseEnter.bind(this));
        this._pointerGridInputListener!.addOnMouseLeaveEventListener(this.onMouseLeave.bind(this));
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
        this._pointerGridInputListener!.removeOnMouseEnterEventListener(this.onMouseEnter.bind(this));
        this._pointerGridInputListener!.removeOnMouseLeaveEventListener(this.onMouseLeave.bind(this));
        this._pointerGridInputListener?.removeOnMouseMoveEventListener(this.onMouseMove.bind(this));
    }

    private onMouseEnter(event: PointerGridEvent): void {
        this._pointerObject!.activeSelf = true;
        this.onMouseMove(event);
    }

    private onMouseLeave(event: PointerGridEvent): void {
        this._pointerObject!.activeSelf = false;
    }

    private onMouseMove(event: PointerGridEvent): void {
        const gridCellWidth = this._pointerGridInputListener!.gridCellWidth;
        const gridCellHeight = this._pointerGridInputListener!.gridCellHeight;
        const positionX = event.gridPosition.x * gridCellWidth;
        const positionY = event.gridPosition.y * gridCellHeight;
        this._pointerObject!.position.set(positionX, positionY, this._pointerZoffset);
    }

    public get pointerZoffset(): number {
        return this._pointerZoffset;
    }

    public set pointerZoffset(value: number) {
        this._pointerZoffset = value;
    }
}
