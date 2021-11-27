import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchyObject/Component";

export class CssSpriteRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _imagePath: string = `${process.env.PUBLIC_URL}/assets/tileRoom3/0.png`;
    private _sprite?: CSS3DSprite;
    private _HTMLImageElement?: HTMLImageElement;

    protected start() {
        this._HTMLImageElement = document.createElement("img");
        this._HTMLImageElement.src = this._imagePath;
        this._HTMLImageElement.style.imageRendering = "pixelated";
        this._HTMLImageElement.addEventListener("load", () => {
            this._sprite = new CSS3DSprite(this._HTMLImageElement?.cloneNode() as HTMLImageElement);
            this._gameObject.add(this._sprite);
        });
    }

    public onDestroy() {
        if (this._sprite) this._gameObject.remove(this._sprite);
    }

    public set imagePath(value: string) {
        this._imagePath = value;
        if (this._HTMLImageElement) {
            this._HTMLImageElement.src = value;
        }
    }

    public get imagePath(): string {
        return this._imagePath;
    }

    // public set htmlImageElement(value: HTMLImageElement|undefined) {
    //     this._HTMLImageElement = value;
    //     if (this._sprite && value) {
    //         this._sprite.element = value;
    //     }
    // }

    // public get htmlImageElement(): HTMLImageElement|undefined {
    //     return this._HTMLImageElement;
    // }
}
