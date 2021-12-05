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
    private _onMouseDownDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onMouseUpDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onMouseEnterDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onMouseLeaveDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onMouseMoveDelegates: ((event: PointerGridEvent) => void)[] = [];

    protected start(): void {
        this._htmlDivElement = document.createElement("div");
        this._css3DObject = new CSS3DObject(this._htmlDivElement);
        this._htmlDivElement.style.width = `${this._inputWidth}px`;
        this._htmlDivElement.style.height = `${this._inputHeight}px`;
        this._htmlDivElement.style.zIndex = Math.floor(this._zindex).toString();
        this._htmlDivElement.addEventListener("mousedown", this.onMouseDown.bind(this));
        this._htmlDivElement.addEventListener("mouseup", this.onMouseUp.bind(this));
        this._htmlDivElement.addEventListener("mouseenter", this.onMouseEnter.bind(this));
        this._htmlDivElement.addEventListener("mouseleave", this.onMouseLeave.bind(this));
        this._htmlDivElement.addEventListener("mousemove", this.onMouseMove.bind(this));
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
            this._htmlDivElement.removeEventListener("mousedown", this.onMouseDown.bind(this));
            this._htmlDivElement.removeEventListener("mouseup", this.onMouseUp.bind(this));
            this._htmlDivElement.removeEventListener("mouseenter", this.onMouseEnter.bind(this));
            this._htmlDivElement.removeEventListener("mouseleave", this.onMouseLeave.bind(this));
            this._htmlDivElement.removeEventListener("mousemove", this.onMouseMove.bind(this));
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
        this._onMouseDownDelegates.forEach(delegate => delegate(gridEvent));
    }
    
    private onMouseUp(event: MouseEvent): void {
        const gridEvent = this.computeGridCellPosition(event.offsetX, event.offsetY);
        this._onMouseUpDelegates.forEach(delegate => delegate(gridEvent));
    }

    private onMouseEnter(event: MouseEvent): void {
        const gridEvent = this.computeGridCellPosition(event.offsetX, event.offsetY);
        this._onMouseEnterDelegates.forEach(delegate => delegate(gridEvent));
    }

    private onMouseLeave(event: MouseEvent): void {
        const gridEvent = this.computeGridCellPosition(event.offsetX, event.offsetY);
        this._onMouseLeaveDelegates.forEach(delegate => delegate(gridEvent));
    }

    private onMouseMove(event: MouseEvent): void {
        const gridEvent = this.computeGridCellPosition(event.offsetX, event.offsetY);
        this._onMouseMoveDelegates.forEach(delegate => delegate(gridEvent));
    }

    public addOnMouseDownEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseDownDelegates.push(delegate);
    }

    public addOnMouseUpEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseUpDelegates.push(delegate);
    }

    public addOnMouseEnterEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseEnterDelegates.push(delegate);
    }

    public addOnMouseLeaveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseLeaveDelegates.push(delegate);
    }

    public addOnMouseMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseMoveDelegates.push(delegate);
    }

    public removeOnMouseDownEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onMouseDownDelegates.indexOf(delegate);
        if (index !== -1) {
            this._onMouseDownDelegates.splice(index, 1);
        }
    }

    public removeOnMouseUpEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onMouseUpDelegates.indexOf(delegate);
        if (index !== -1) {
            this._onMouseUpDelegates.splice(index, 1);
        }
    }

    public removeOnMouseEnterEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onMouseEnterDelegates.indexOf(delegate);
        if (index !== -1) {
            this._onMouseEnterDelegates.splice(index, 1);
        }
    }

    public removeOnMouseLeaveEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onMouseLeaveDelegates.indexOf(delegate);
        if (index !== -1) {
            this._onMouseLeaveDelegates.splice(index, 1);
        }
    }

    public removeOnMouseMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onMouseMoveDelegates.indexOf(delegate);
        if (index !== -1) {
            this._onMouseMoveDelegates.splice(index, 1);
        }
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
