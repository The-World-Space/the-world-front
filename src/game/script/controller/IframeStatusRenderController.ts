import { Component, GameObject, CssHtmlElementRenderer } from "the-world-engine";

export class IframeStatusRenderController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    
    private _idBoxObject: GameObject|null = null;
    private _idBox: CssHtmlElementRenderer|null = null;
    private _idBoxString: string = "";
    private _id: number = 0;
    private _onKeyDownBind = this.onKeyDown.bind(this);
    private _onKeyUpBind = this.onKeyUp.bind(this);

    protected start(): void {
        this.engine.input.addOnKeyUpEventListener(this._onKeyUpBind);
    }

    public onDestroy(): void {
        this.engine.input.removeOnKeyUpEventListener(this._onKeyUpBind);
    }

    public onEnable(): void {
        this.engine.input.addOnKeyDownEventListener(this._onKeyDownBind);
    }

    public onDisable(): void {
        this.engine.input.removeOnKeyDownEventListener(this._onKeyDownBind);
    }

    private onKeyDown(e: KeyboardEvent): void {
        if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {   
            if (this._idBoxObject) { 
                this._idBoxObject.activeSelf = true;
                if (this._idBox) {
                    const container = this._idBox.getElementContainer();
                    if (container) container.innerText = this._idBoxString;
                }
            }
        }
    }

    private onKeyUp(e: KeyboardEvent): void {
        if (e.key === "Control") {
            if (this._idBoxObject) {
                this._idBoxObject.activeSelf = false;
            }
        }
    }

    public setIdBoxObject(gameObject: GameObject): void {
        this._idBoxObject = gameObject;
    }

    public setIdBoxRenderer(renderer: CssHtmlElementRenderer): void {
        this._idBox = renderer;
        const container = this._idBox.getElementContainer();
        if (container) container.innerHTML = this._idBoxString;
    }

    public setIdBoxText(value: number): void {
        this._id = value;
        this._idBoxString = `id: ${value}`;
        if (this._idBox) {
            const container = this._idBox.getElementContainer();
            if (container) container.innerText = this._idBoxString;
        }
    }

    public get id(): number {
        return this._id;
    }
}
