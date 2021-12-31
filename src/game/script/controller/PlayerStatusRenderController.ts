import {
    CoroutineIterator,
    ICoroutine,
    WaitForSeconds,
    Component,
    GameObject,
    CssHtmlElementRenderer,
    CssTextRenderer
} from "the-world-engine";

export class PlayerStatusRenderController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    
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

    public setChatBoxText(value: string|null, showSeconds = 5, defaultOpacity = 0.5): void {
        if (this._chatBoxCoroutine) this.stopCoroutine(this._chatBoxCoroutine);
        if (value === null) {
            this.setChatBoxFromString(null);
        } else {
            this._chatBoxCoroutine = this.startCorutine(this.chatBoxShowAnimation(value, 0.5, showSeconds, 0.5, defaultOpacity));
        }
    }

    private *chatBoxShowAnimation(
        text: string,
        showingSeconds: number,
        duration: number,
        fadeOutSeconds: number,
        defaultOpacity: number
    ): CoroutineIterator {
        //initialize opacity
        if (this._chatBox) {
            const container = this._chatBox.getElementContainer();
            if (container) {
                container.style.transition = `opacity ${duration}s`;
                container.style.opacity = `${defaultOpacity}`;
            }
        }

        //showing
        let accumulatedTime = 0;
        let lastValue = 0;
        while (accumulatedTime < showingSeconds) {
            const deltaTime = this.engine.time.deltaTime;
            accumulatedTime += deltaTime;
            const textShowLength = Math.floor(accumulatedTime / showingSeconds * text.length);
            if (textShowLength > lastValue) {
                this.setChatBoxFromString(text.substring(0, textShowLength));
                lastValue = textShowLength;
            }
            yield null;
        }
        this.setChatBoxFromString(text);

        //waiting
        yield new WaitForSeconds(duration);

        //fade out
        if (this._chatBox) {
            const container = this._chatBox.getElementContainer();
            if (container) container.style.opacity = "0";
        }
        yield new WaitForSeconds(fadeOutSeconds);
        
        //hide
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
