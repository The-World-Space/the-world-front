import { Vector2 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchy_object/Component";

enum PointerState {
    Hover,
    Down,
    Out
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
    private _pointerState: PointerState = PointerState.Out;

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

    public update(): void {
        this._css3DObject!.position.x = this.gameManager.camera.position.x;
        this._css3DObject!.position.y = this.gameManager.camera.position.y;
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

    private computeGridCellPosition(vector2: Vector2): Vector2 {
        return new Vector2(
            Math.floor(vector2.x / this._gridCellWidth),
            Math.floor(vector2.y / this._gridCellHeight)
        );
    }

    private onMouseEnter(event: MouseEvent): void {
        const computedPosition = this.computeGridCellPosition(new Vector2(event.offsetX, event.offsetY));
        console.log(`mouse enter: ${computedPosition.x}, ${computedPosition.y}`);
    }

    private onMouseMove(event: MouseEvent): void {
        const computedPosition = this.computeGridCellPosition(new Vector2(event.offsetX, event.offsetY));
        console.log(`mouse move: ${computedPosition.x}, ${computedPosition.y}`);
    }

    private onMouseLeave(event: MouseEvent): void {
        const computedPosition = this.computeGridCellPosition(new Vector2(event.offsetX, event.offsetY));
        console.log(`mouse leave: ${computedPosition.x}, ${computedPosition.y}`);
    }

    private onMouseDown(event: MouseEvent): void {
        const computedPosition = this.computeGridCellPosition(new Vector2(event.offsetX, event.offsetY));
        console.log(`mouse down: ${computedPosition.x}, ${computedPosition.y}`);
    }

    private onMouseUp(event: MouseEvent): void {
        const computedPosition = this.computeGridCellPosition(new Vector2(event.offsetX, event.offsetY));
        console.log(`mouse up: ${computedPosition.x}, ${computedPosition.y}`);
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
