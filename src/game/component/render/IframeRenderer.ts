import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchyObject/Component";

export class IframeRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    
    private _width: number = 128;
    private _height: number = 128;
    private _sprite: CSS3DObject|null = null;
    private _htmlIframeElement: HTMLIFrameElement|null = null;
    private _iframeSource: string = "";

    protected start(): void { 
        this.drawIframe();
    }

    public onDestroy(): void {
        if (this._sprite) this.gameObject.remove(this._sprite);
    }

    private drawIframe(): void {
        const tileMapWidth: number = this._width;
        const tileMapHeight: number = this._height;
        this._htmlIframeElement = document.createElement("iframe") as HTMLIFrameElement;
        this._htmlIframeElement.width = tileMapWidth.toString();
        this._htmlIframeElement.height = tileMapHeight.toString();
        this._htmlIframeElement.src = this._iframeSource;
        this._htmlIframeElement.style.border = "none";
        this._sprite = new CSS3DObject(this._htmlIframeElement);
        this.gameObject.add(this._sprite);
    }

    public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;

        if (this._htmlIframeElement) {
            this._htmlIframeElement.width = value.toString();
        }
    }

    public get height(): number {
        return this._height;
    }

    public set height(value: number) {
        this._height = value;

        if (this._htmlIframeElement) {
            this._htmlIframeElement.height = value.toString();
        }
    }

    public get iframeSource(): string {
        return this._iframeSource;
    }

    public set iframeSource(value: string) {
        this._iframeSource = value;

        if (this._htmlIframeElement) {
            this._htmlIframeElement.src = value;
        }
    }
}
