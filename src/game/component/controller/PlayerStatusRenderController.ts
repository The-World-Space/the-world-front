import { CoroutineIterator } from "../../engine/coroutine/CoroutineIterator";
import { ICoroutine } from "../../engine/coroutine/ICoroutine";
import { WaitForSeconds } from "../../engine/coroutine/YieldInstruction";
import { Component } from "../../engine/hierarchy_object/Component";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";
import { CssTextRenderer } from "../render/CssTextRenderer";

export class PlayerStatusRenderController extends Component {
    private _nameTagObject: GameObject|null = null;
    private _nameTag: CssTextRenderer|null = null;
    private _nameTagString: string|null = null;
    private _chatBoxObject: GameObject|null = null;
    private _chatBox: CssHtmlElementRenderer|null = null;
    private _chatBoxString: string = "";
    private _chatBoxCoroutine: ICoroutine|null = null;

    public setNameTagObject(gameObject: GameObject): void {
        this._nameTagObject = gameObject;
    }

    public setNameTagRenderer(renderer: CssTextRenderer): void {
        this._nameTag = renderer;
        this._nameTag.text = this._nameTagString;
    }

    public setChatBoxObject(gameObject: GameObject): void {
        this._chatBoxObject = gameObject;
    }

    public setChatBoxRenderer(renderer: CssHtmlElementRenderer): void {
        this._chatBox = renderer;
        const container = this._chatBox.getElementContainer();
        if (container) container.innerHTML = this._chatBoxString;
    }

    public get nameTag(): string|null {
        return this._nameTagString;
    }

    public set nameTag(value: string|null) {
        this._nameTagString = value ?? "";
        this.setNameTagFromString(value);
    }

    public setChatBoxText(value: string|null, showSeconds: number = 5): void {
        if (this._chatBoxCoroutine) this.stopCoroutine(this._chatBoxCoroutine);
        this.setChatBoxFromString(value);
        this._chatBoxCoroutine = this.startCorutine(this.chatBoxHideAfterSeconds(showSeconds));
    }

    private *chatBoxHideAfterSeconds(seconds: number): CoroutineIterator {
        yield new WaitForSeconds(seconds);
        this.setChatBoxFromString(null);
    }

    private setNameTagFromString(value: string|null): void {
        if (value === null) {
            this._nameTagString = "";
            if (this._nameTagObject) this._nameTagObject.activeSelf = false;
            if (this._nameTag) this._nameTag.text = "";
        } else {
            this._nameTagString = value;
            if (this._nameTagObject) this._nameTagObject.activeSelf = true;
            if (this._nameTag) this._nameTag.text = value;
        }
    }

    private setChatBoxFromString(value: string|null): void {
        if (value === null) {
            this._chatBoxString = "";
            if (this._chatBoxObject) this._chatBoxObject.activeSelf = false;
            if (this._chatBox) {
                const container = this._chatBox.getElementContainer();
                if (container) container.innerText = "";
            }
        } else {
            this._chatBoxString = value;
            if (this._chatBoxObject) this._chatBoxObject.activeSelf = true;
            if (this._chatBox) {
                const container = this._chatBox.getElementContainer();
                if (container) container.innerText = value;
            }
        }
    }
}
