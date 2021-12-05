import { Vector2, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchy_object/Component";
import { IGridCollidable } from "../physics/IGridColidable";

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
    private _onMouseMoveDelegates: ((event: PointerGridEvent) => void)[] = [];

    protected start(): void {
        this._htmlDivElement = document.createElement("div");
        this._css3DObject = new CSS3DObject(this._htmlDivElement);
        this._htmlDivElement.style.width = `${this._inputWidth}px`;
        this._htmlDivElement.style.height = `${this._inputHeight}px`;
        this._htmlDivElement.style.zIndex = Math.floor(this._zindex).toString();
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

    private computeGridCellPosition(x: number, y: number): Vector2 {
        return new Vector2(
            Math.floor(x / this._gridCellWidth),
            Math.ceil(y / this._gridCellHeight)
        );
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

    public addOnMouseMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseMoveDelegates.push(delegate);
    }

    public removeOnMouseMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onMouseMoveDelegates = this._onMouseMoveDelegates.filter(d => d !== delegate);
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
