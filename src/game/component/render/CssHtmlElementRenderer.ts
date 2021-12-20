import { Vector2 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";
import { renderToStaticMarkup } from "react-dom/server"

export class CssHtmlElementRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _css3DObject: CSS3DObject|null = null;
    private _htmlDivElement: HTMLDivElement|null = null;
    private readonly _centerOffset: Vector2 = new Vector2(0, 0);
    private _zindex: number = 0;
    private _elementWidth: number = 16;
    private _elementHeight: number = 16;
    private _autoSize: boolean = false;
    private _pointerEvents: boolean = true;

    private _initializeFunction: (() => void)|null = null;

    private static readonly _defaultElement: HTMLDivElement = document.createElement("div");

    protected start(): void {
        this._initializeFunction?.call(this);
        if (!this._htmlDivElement) {
            this.setElement(CssHtmlElementRenderer._defaultElement);
        }

        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
    }

    public onDestroy(): void {
        if (!this.started) return;
        if (this._css3DObject) this.gameObject.unsafeGetTransform().remove(this._css3DObject); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
    }

    public onEnable(): void {
        if (this._css3DObject) this._css3DObject.visible = true;
    }

    public onDisable(): void {
        if (this._css3DObject) this._css3DObject.visible = false;
    }

    public onSortByZaxis(zaxis: number): void {
        this._zindex = zaxis;
        if (this._css3DObject) {
            this._css3DObject.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }

    public getElementContainer(): HTMLDivElement|null {
        return this._htmlDivElement;
    }

    public setElement(value: HTMLDivElement|null) {
        if (!this.started && !this.starting) {
            this._initializeFunction = () => {
                this.setElement(value);
            };
            return;
        }

        if (!value) value = CssHtmlElementRenderer._defaultElement;

        if (!this._htmlDivElement) {
            this._htmlDivElement = document.createElement("div");
        }

        this._htmlDivElement = value;
        
        if (!this._css3DObject) {
            this._css3DObject = new CSS3DObject(this._htmlDivElement);
            if (this._elementWidth === 0) this._elementWidth = this._htmlDivElement.offsetWidth;
            if (this._elementHeight === 0) this._elementHeight = this._htmlDivElement.offsetHeight;
            if (this._autoSize) {
                this._htmlDivElement.style.width = "auto";
                this._htmlDivElement.style.height = "auto";
            } else {
                this._htmlDivElement.style.width = `${this._elementWidth}px`;
                this._htmlDivElement.style.height = `${this._elementHeight}px`;
            }
            this._htmlDivElement.style.pointerEvents = this._pointerEvents ? "auto" : "none";
            
            this._htmlDivElement.style.zIndex = Math.floor(this._zindex).toString();
            this._css3DObject.position.set(
                this._htmlDivElement.offsetWidth * this._centerOffset.x,
                this._htmlDivElement.offsetHeight * this._centerOffset.y, 0
            );
            this.gameObject.unsafeGetTransform().add(this._css3DObject); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
    
            if (this.enabled && this.gameObject.activeInHierarchy) this._css3DObject.visible = true;
            else this._css3DObject.visible = false;
        }
    }

    public setElementFromJSX(element: JSX.Element): void {
        if (!this.started && !this.starting) {
            this._initializeFunction = () => {
                this.setElementFromJSX(element);
            };
            return;
        }

        if (element.type !== "div") {
            throw new Error("CssHtmlElementRenderer only support div element");
        }
        const htmlString = `<div>${renderToStaticMarkup(element)}</div>`;
        const template = document.createElement("template");
        template.innerHTML = htmlString;
        this.setElement(template.content.firstChild as HTMLDivElement);
    }
    
    public get centerOffset(): Vector2 {
        return this._centerOffset.clone();
    }

    public set centerOffset(value: Vector2) {
        this._centerOffset.copy(value);
        if (this._css3DObject) {
            this._css3DObject.position.set(
                this._htmlDivElement!.offsetWidth * this._centerOffset.x,
                this._htmlDivElement!.offsetHeight * this._centerOffset.y, 0
            );
        }
    }

    public get elementWidth(): number {
        return this._elementWidth;
    }

    public set elementWidth(value: number) {
        this._elementWidth = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.width = `${value}px`;
        }
    }

    public get elementHeight(): number {
        return this._elementHeight;
    }

    public set elementHeight(value: number) {
        this._elementHeight = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.height = `${value}px`;
        }
    }

    public get autoSize(): boolean {
        return this._autoSize;
    }

    public set autoSize(value: boolean) {
        this._autoSize = value;
        if (this._htmlDivElement) {
            if (value) {
                this._htmlDivElement.style.width = "auto";
                this._htmlDivElement.style.height = "auto";
            } else {
                this._htmlDivElement.style.width = `${this._elementWidth}px`;
                this._htmlDivElement.style.height = `${this._elementHeight}px`;
            }
        }
    }

    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.pointerEvents = value ? "auto" : "none";
        }
    }
}
