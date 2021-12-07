import { Vector2, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchy_object/Component";
import { IGridCollidable } from "../physics/IGridCollidable";

export class PointerGridEvent {
    private _gridPosition: Vector2;
    private _position: Vector2;

    constructor(gridPosition: Vector2, position: Vector2) {
        this._gridPosition = new Vector2(gridPosition.x, gridPosition.y);
        this._position = new Vector2(position.x, position.y);
    }

    public get gridPosition(): Vector2 {
        return this._gridPosition;
    }

    public get position(): Vector2 {
        return this._position;
    }
}

export class PointerGridInputListener extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _css3DObject: CSS3DObject|null = null;
    private _htmlDivElement: HTMLDivElement|null = null;
    private _gridCellWidth: number = 16;
    private _gridCellHeight: number = 16;
    private readonly _gridCenter: Vector2 = new Vector2();
    private _inputWidth: number = 64;
    private _inputHeight: number = 64;
    private _zindex: number = 0;
    private _onPointerDownDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onPointerUpDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onPointerEnterDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onPointerLeaveDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onPointerMoveDelegates: ((event: PointerGridEvent) => void)[] = [];

    private readonly _onMouseDownBind = this.onMouseDown.bind(this);
    private readonly _onMouseUpBind = this.onMouseUp.bind(this);
    private readonly _onMouseEnterBind = this.onMouseEnter.bind(this);
    private readonly _onMouseLeaveBind = this.onMouseLeave.bind(this);
    private readonly _onMouseMoveBind = this.onMouseMove.bind(this);
    private readonly _onTouchStartBind = this.onTouchStart.bind(this);
    private readonly _ononTouchEndBind = this.onTouchEnd.bind(this);
    private readonly _onTouchMoveBind = this.onTouchMove.bind(this);
    private readonly _onTouchCancelBind = this.onTouchCancel.bind(this);

    protected start(): void {
        this._htmlDivElement = document.createElement("div");
        this._css3DObject = new CSS3DObject(this._htmlDivElement);
        this._htmlDivElement.style.width = `${this._inputWidth}px`;
        this._htmlDivElement.style.height = `${this._inputHeight}px`;
        this._htmlDivElement.style.zIndex = Math.floor(this._zindex).toString();
        this._htmlDivElement.addEventListener("mousedown", this._onMouseDownBind);
        this._htmlDivElement.addEventListener("mouseup", this._onMouseUpBind);
        this._htmlDivElement.addEventListener("mouseenter", this._onMouseEnterBind);
        this._htmlDivElement.addEventListener("mouseleave", this._onMouseLeaveBind);
        this._htmlDivElement.addEventListener("mousemove", this._onMouseMoveBind);
        this._htmlDivElement.addEventListener("touchstart", this._onTouchStartBind); //todo: fix this
        this._htmlDivElement.addEventListener("touchend", this._ononTouchEndBind);
        this._htmlDivElement.addEventListener("touchmove", this._onTouchMoveBind);
        this._htmlDivElement.addEventListener("touchcancel", this._onTouchCancelBind);
        this.gameObject.add(this._css3DObject);
    }

    private readonly _tempVector3: Vector3 = new Vector3();

    public update(): void {
        this._tempVector3.copy(this.gameManager.camera.position);
        const cameraLocalPosition = this.gameObject.worldToLocal(this._tempVector3);
        this._css3DObject!.position.x = cameraLocalPosition.x;
        this._css3DObject!.position.y = cameraLocalPosition.y;
    }

    public onDestroy(): void {
        if (this._htmlDivElement) { //It's the intended useless branch
            this._htmlDivElement.removeEventListener("mousedown", this._onMouseDownBind);
            this._htmlDivElement.removeEventListener("mouseup", this._onMouseUpBind);
            this._htmlDivElement.removeEventListener("mouseenter", this._onMouseEnterBind);
            this._htmlDivElement.removeEventListener("mouseleave", this._onMouseLeaveBind);
            this._htmlDivElement.removeEventListener("mousemove", this._onMouseMoveBind);
            this._htmlDivElement.removeEventListener("touchstart", this._onTouchStartBind);
            this._htmlDivElement.removeEventListener("touchend", this._ononTouchEndBind);
            this._htmlDivElement.removeEventListener("touchmove", this._onTouchMoveBind);
            this._htmlDivElement.removeEventListener("touchcancel", this._onTouchCancelBind);
        }
        if (this._css3DObject) this.gameObject.remove(this._css3DObject);
    }

    public onSortByZaxis(zaxis: number): void {
        this._zindex = zaxis;
        if (this._css3DObject) {
            this._css3DObject.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }

    private computeGridCellPosition(offsetX: number, offsetY: number): PointerGridEvent {
        const worldPosition = this.gameObject.getWorldPosition(this._tempVector3);
        
        const positionX = this._css3DObject!.position.x + worldPosition.x - this._inputWidth / 2 + 
            offsetX- this._gridCenter.x;
        const positionY = this._css3DObject!.position.y + worldPosition.y - this._inputHeight / 2 + 
            (this._inputHeight - offsetY) - this._gridCenter.y;
        
        const gridPositionX = Math.floor((positionX + this._gridCellWidth / 2) / this._gridCellWidth);
        const gridPositionY = Math.floor((positionY + this._gridCellHeight / 2) / this._gridCellHeight);
        
        return new PointerGridEvent(
            new Vector2(gridPositionX, gridPositionY),
            new Vector2(positionX, positionY)
        );
    }

    private onMouseDown(event: MouseEvent): void {
        const gridEvent = this.computeGridCellPosition(event.offsetX, event.offsetY);
        this._onPointerDownDelegates.forEach(delegate => delegate(gridEvent));
    }
    
    private onMouseUp(event: MouseEvent): void {
        const gridEvent = this.computeGridCellPosition(event.offsetX, event.offsetY);
        this._onPointerUpDelegates.forEach(delegate => delegate(gridEvent));
    }

    private onMouseEnter(event: MouseEvent): void {
        const gridEvent = this.computeGridCellPosition(event.offsetX, event.offsetY);
        this._onPointerEnterDelegates.forEach(delegate => delegate(gridEvent));
    }

    private onMouseLeave(event: MouseEvent): void {
        const gridEvent = this.computeGridCellPosition(event.offsetX, event.offsetY);
        this._onPointerLeaveDelegates.forEach(delegate => delegate(gridEvent));
    }

    private onMouseMove(event: MouseEvent): void {
        const gridEvent = this.computeGridCellPosition(event.offsetX, event.offsetY);
        this._onPointerMoveDelegates.forEach(delegate => delegate(gridEvent));
    }

    private simulateMouseEvent(eventName: string, touch: Touch): void {
        const simulatedEvent = new MouseEvent(
            eventName, {
            bubbles: true, cancelable: true, view: window, detail: 1,
            screenX: touch.screenX, screenY: touch.screenY, clientX: touch.clientX, clientY: touch.clientY,
            ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, button: 0, relatedTarget: null
        });
        touch.target.dispatchEvent(simulatedEvent);
    }

    private onTouchStart(event: TouchEvent): void {
        this.simulateMouseEvent("mouseenter", event.touches[0]);
        this.simulateMouseEvent("mousedown", event.touches[0]);
    }

    private onTouchEnd(event: TouchEvent): void {
        this.simulateMouseEvent("mouseup", event.changedTouches[0]);
        this.simulateMouseEvent("mouseleave", event.changedTouches[0]);
    }

    private onTouchMove(event: TouchEvent): void {
        this.simulateMouseEvent("mousemove", event.touches[0]);
    }

    private onTouchCancel(event: TouchEvent): void {
        this.simulateMouseEvent("mouseleave", event.changedTouches[0]);
    }

    public addOnPointerDownEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerDownDelegates.push(delegate);
    }

    public addOnPointerUpEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerUpDelegates.push(delegate);
    }

    public addOnPointerEnterEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerEnterDelegates.push(delegate);
    }

    public addOnPointerLeaveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerLeaveDelegates.push(delegate);
    }

    public addOnPointerMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerMoveDelegates.push(delegate);
    }

    public removeOnPointerDownEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerDownDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerDownDelegates.splice(index, 1);
    }

    public removeOnPointerUpEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerUpDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerUpDelegates.splice(index, 1);
    }

    public removeOnPointerEnterEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerEnterDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerEnterDelegates.splice(index, 1);
    }

    public removeOnPointerLeaveEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerLeaveDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerLeaveDelegates.splice(index, 1);
    }

    public removeOnPointerMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerMoveDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerMoveDelegates.splice(index, 1);
    }

    public get gridCenter(): Vector2 {
        return this._gridCenter.clone();
    }

    public set gridCenter(value: Vector2) {
        this._gridCenter.copy(value);
    }
    
    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }

    public set gridCellWidth(value: number) {
        this._gridCellWidth = value;
    }

    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    public set gridCellHeight(value: number) {
        this._gridCellHeight = value;
    }
    
    public setGridInfoFromCollideMap(collideMap: IGridCollidable): void {
        this._gridCellWidth = collideMap.gridCellWidth;
        this._gridCellHeight = collideMap.gridCellHeight;
        this._gridCenter.set(collideMap.gridCenterX, collideMap.gridCenterY);
    }

    public get inputWidth(): number {
        return this._inputWidth;
    }

    public set inputWidth(value: number) {
        this._inputWidth = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.width = `${this._inputWidth}px`;
        }
    }

    public get inputHeight(): number {
        return this._inputHeight;
    }

    public set inputHeight(value: number) {
        this._inputHeight = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.height = `${this._inputHeight}px`;
        }
    }
}
