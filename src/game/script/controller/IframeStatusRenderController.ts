import { Component, CssHtmlElementRenderer, GameObject } from "the-world-engine";

export class IframeStatusRenderController extends Component {
    public readonly disallowMultipleComponent: boolean = true;
    
    private _idBoxObject: GameObject|null = null;
    private _idBox: CssHtmlElementRenderer|null = null;
    private _idBoxString = "";
    private _id = 0;

    public onEnable(): void {
        this.engine.input.onKeyDown.addListener(this.onKeyDown);
        this.engine.input.onKeyUp.addListener(this.onKeyUp);
    }

    public onDisable(): void {
        this.engine.input.onKeyDown.removeListener(this.onKeyDown);
        this.engine.input.onKeyUp.removeListener(this.onKeyUp);
    }

    private readonly onKeyDown = (e: KeyboardEvent): void => {
        if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {   
            if (this._idBoxObject) {
                this._idBoxObject.activeSelf = true;
                if (this._idBox) {
                    const container = this._idBox.element;
                    if (container) container.innerText = this._idBoxString;
                }
            }
        }
    };

    private readonly onKeyUp = (e: KeyboardEvent): void => {
        if (e.key === "Control") {
            if (this._idBoxObject) {
                this._idBoxObject.activeSelf = false;
            }
        }
    };

    public setIdBoxObject(gameObject: GameObject): void {
        this._idBoxObject = gameObject;
    }

    public setIdBoxRenderer(renderer: CssHtmlElementRenderer): void {
        this._idBox = renderer;
        const container = this._idBox.element;
        if (container) container.innerText = this._idBoxString;
    }

    public setIdBoxText(value: number): void {
        this._id = value;
        this._idBoxString = `id: ${value}`;
        if (this._idBox) {
            const container = this._idBox.element;
            if (container) container.innerText = this._idBoxString;
        }
    }

    public get id(): number {
        return this._id;
    }
}
