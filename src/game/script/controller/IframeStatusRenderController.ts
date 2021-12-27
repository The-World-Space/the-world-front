import { Component } from "../../engine/hierarchy_object/Component";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";

export class IframeStatusRenderController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    
    private _idBoxObject: GameObject|null = null;
    private _idBox: CssHtmlElementRenderer|null = null;
    private _idBoxString: string = "";
    private _onKeyDownBind = this.onKeyDown.bind(this);
    private _onKeyUpBind = this.onKeyUp.bind(this);

    protected start(): void {
        this.engine.input.addOnKeyDownEventListener(this._onKeyDownBind);
        this.engine.input.addOnKeyUpEventListener(this._onKeyUpBind);
    }

    public onDestroy(): void {
        this.engine.input.removeOnKeyDownEventListener(this._onKeyDownBind);
        this.engine.input.removeOnKeyUpEventListener(this._onKeyUpBind);
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
        if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
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

    public setIdBoxText(value: string): void {
        this._idBoxString = value;
        if (this._idBox) {
            const container = this._idBox.getElementContainer();
            if (container) container.innerText = value;
        }
    }
}
