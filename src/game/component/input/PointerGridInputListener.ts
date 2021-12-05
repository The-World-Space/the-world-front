import { Vector2, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchy_object/Component";

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
    private _inputWidth: number = 64;
    private _inputHeight: number = 64;
    private _zindex: number = 0;
    private _onMouseEnterDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onMouseMoveDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onMouseLeaveDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onMouseDownDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onMouseUpDelegates: ((event: PointerGridEvent) => void)[] = [];

    protected start(): void {
        this._htmlDivElement = document.createElement("div");
        this._css3DObject = new CSS3DObject(this._htmlDivElement);
        this._htmlDivElement.style.width = `${this._inputWidth}px`;
        this._htmlDivElement.style.height = `${this._inputHeight}px`;
        this._htmlDivElement.style.zIndex = Math.floor(this._zindex).toString();
        this._htmlDivElement.addEventListener("mouseenter", this.onMouseEnter.bind(this));
        this._htmlDivElement.addEventListener("mousemove", this.onMouseMove.bind(this));
        this._htmlDivElement.addEventListener("mouseleave", this.onMouseLeave.bind(this));
        this._htmlDivElement.addEventListener("mousedown", this.onMouseDown.bind(this));
        this._htmlDivElement.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.gameObject.add(this._css3DObject);
    }

    private _tempVector3: Vector3 = new Vector3();

    public update(): void {
        this._tempVector3.copy(this.gameManager.camera.position);
        const cameraLocalPosition = this.gameObject.worldToLocal(this._tempVector3);
        this._css3DObject!.position.x = cameraLocalPosition.x;
        this._css3DObject!.position.y = cameraLocalPosition.y;
    }

    public onDestroy(): void {
        if (this._htmlDivElement) { //It's the intended useless branch
            this._htmlDivElement.removeEventListener("mouseenter", this.onMouseEnter.bind(this));
            this._htmlDivElement.removeEventListener("mousemove", this.onMouseMove.bind(this));
            this._htmlDivElement.removeEventListener("mouseleave", this.onMouseLeave.bind(this));
            this._htmlDivElement.removeEventListener("mousedown", this.onMouseDown.bind(this));
            this._htmlDivElement.removeEventListener("mouseup", this.onMouseUp.bind(this));
        }
        if (this._css3DObject) this.gameObject.remove(this._css3DObject);
    }

    public onSortByZaxis(zaxis: number): void {
        this._zindex = zaxis;
        if (this._css3DObject) {
            this._css3DObject.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }

    private computeGridCellPosition(x: number, y: number): Vector2 {
        return new Vector2(
            Math.floor(x / this._gridCellWidth),
            Math.ceil(y / this._gridCellHeight)
        );
    }

    private onMouseEnter(event: MouseEvent): void {
        this._tempVector3.copy(this.gameObject.position);
        const worldPosition = this.gameObject.localToWorld(this._tempVector3);
        const positionX = worldPosition.x - this._inputWidth / 2 + event.offsetX;
        const positionY = worldPosition.y - (this._inputHeight - event.offsetY);
        const computedPosition = this.computeGridCellPosition(positionX, positionY);
        const pointerGridEvent = new PointerGridEvent(computedPosition, new Vector2(positionX, positionY));
        this._onMouseEnterDelegates.forEach((delegate) => {
            delegate(pointerGridEvent);
        });
    }

    private onMouseMove(event: MouseEvent): void {
        this._tempVector3.copy(this.gameObject.position);
        const worldPosition = this.gameObject.localToWorld(this._tempVector3);
        console.log(this.gameObject.matrixWorld);
        const positionX = this._css3DObject!.position.x - worldPosition.x - this._inputWidth / 2 + event.offsetX;
        const positionY = this._css3DObject!.position.y - worldPosition.y - (this._inputHeight - event.offsetY);
        const computedPosition = this.computeGridCellPosition(positionX, positionY);
        console.log(this._css3DObject!.position);
        console.log(this._tempVector3);
        // console.log(`mouse move: ${computedPosition.x}, ${computedPosition.y}`);
        // console.log(`mouse move offset: ${event.offsetX}, ${event.offsetY}`);
        const pointerGridEvent = new PointerGridEvent(computedPosition, new Vector2(positionX, positionY));
        this._onMouseMoveDelegates.forEach((delegate) => {
            delegate(pointerGridEvent);
        });
    }

    private onMouseLeave(event: MouseEvent): void {
        this._tempVector3.copy(this.gameObject.position);
        const worldPosition = this.gameObject.localToWorld(this._tempVector3);
        const positionX = worldPosition.x - this._inputWidth / 2 + event.offsetX;
        const positionY = worldPosition.y - (this._inputHeight - event.offsetY);
        const computedPosition = this.computeGridCellPosition(positionX, positionY);
        const pointerGridEvent = new PointerGridEvent(computedPosition, new Vector2(positionX, positionY));
        this._onMouseLeaveDelegates.forEach((delegate) => {
            delegate(pointerGridEvent);
        });
    }

    private onMouseDown(event: MouseEvent): void {
        this._tempVector3.copy(this.gameObject.position);
        const worldPosition = this.gameObject.localToWorld(this._tempVector3);
        const positionX = worldPosition.x - this._inputWidth / 2 + event.offsetX;
        const positionY = worldPosition.y - (this._inputHeight - event.offsetY);
        const computedPosition = this.computeGridCellPosition(positionX, positionY);
        const pointerGridEvent = new PointerGridEvent(computedPosition, new Vector2(positionX, positionY));
        this._onMouseDownDelegates.forEach((delegate) => {
            delegate(pointerGridEvent);
        });
    }

    private onMouseUp(event: MouseEvent): void {
        this._tempVector3.copy(this.gameObject.position);
        const worldPosition = this.gameObject.localToWorld(this._tempVector3);
        const positionX = worldPosition.x - this._inputWidth / 2 + event.offsetX;
        const positionY = worldPosition.y - (this._inputHeight - event.offsetY);
        const computedPosition = this.computeGridCellPosition(positionX, positionY);
        const pointerGridEvent = new PointerGridEvent(computedPosition, new Vector2(positionX, positionY));
        this._onMouseUpDelegates.forEach((delegate) => {
            delegate(pointerGridEvent);
        });
    }

    public addOnMouseEnterEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseEnterDelegates.push(delegate);
    }

    public addOnMouseMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseMoveDelegates.push(delegate);
    }

    public addOnMouseLeaveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseLeaveDelegates.push(delegate);
    }

    public addOnMouseDownEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseDownDelegates.push(delegate);
    }

    public addOnMouseUpEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseUpDelegates.push(delegate);
    }

    public removeOnMouseEnterEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseEnterDelegates = this._onMouseEnterDelegates.filter(d => d !== delegate);
    }

    public removeOnMouseMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseMoveDelegates = this._onMouseMoveDelegates.filter(d => d !== delegate);
    }

    public removeOnMouseLeaveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseLeaveDelegates = this._onMouseLeaveDelegates.filter(d => d !== delegate);
    }

    public removeOnMouseDownEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseDownDelegates = this._onMouseDownDelegates.filter(d => d !== delegate);
    }

    public removeOnMouseUpEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseUpDelegates = this._onMouseUpDelegates.filter(d => d !== delegate);
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
