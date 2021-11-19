import { Size } from "../Base";
import { DomShape } from "./DomShape";
import { PIXELSIZE } from "../../Renderer/Renderer";

export class IframeShape extends DomShape<HTMLIFrameElement> {
    private _src = "";

    constructor(size: Size, src: string) {
        super(size, document.createElement("iframe"));
        this.setSrc(src);
        this.getDom().style.border = "none";
    }

    getSrc() {
        return this._src;
    }

    setSrc(src: string) {
        this._src = src;
        this.getDom().src = src;
    }

    setDom(dom: HTMLIFrameElement) {
        super.setDom(dom);
        this.getDom().style.border = "none";
    }

    setSize(size: Size) {
        super.setSize(size);
        this.getDom().width = String(size.width * PIXELSIZE);
        this.getDom().height = String(size.height * PIXELSIZE);
    }
}