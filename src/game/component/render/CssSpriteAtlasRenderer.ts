import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchyObject/Component";

export class CssSpriteAtlasRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _sprite: CSS3DSprite|null = null;
    private _HTMLImageElement: HTMLImageElement|null = null;
    private _rowCount: number = 1;
    private _columnCount: number = 1;
    private _croppedImageWidth: number = 0;
    private _croppedImageHeight: number = 0;
    private _currentImageIndex: number = 0;
    private static readonly _defaultImagePath: string = `${process.env.PUBLIC_URL}/assets/default.png`;

    protected start(): void {
        if (!this._HTMLImageElement) {
            this.setImage(CssSpriteAtlasRenderer._defaultImagePath, 1, 1);
        }
    }

    public onDestroy(): void {
        if (this._sprite) this._gameObject.remove(this._sprite);
    }

    public get imagePath(): string|null {
        return this._HTMLImageElement?.src || null;
    }

    public setImage(path: string, rowCount: number, columnCount: number): void {
        this._rowCount = rowCount;
        this._columnCount = columnCount;

        if (!this._HTMLImageElement) {
            this._HTMLImageElement = document.createElement("img");
            this._HTMLImageElement.style.imageRendering = "pixelated";
            this._HTMLImageElement.style.
        }

        this._HTMLImageElement.src = path;

        this._HTMLImageElement.addEventListener("load", () => {
            let a = this.width;
            if (!this._sprite) {
                this._sprite = new CSS3DSprite(this._HTMLImageElement as HTMLImageElement);
                this._gameObject.add(this._sprite);
            }
        });
    }

    public get rowCount(): number {
        return this._rowCount;
    }

    public get columnCount(): number {
        return this._columnCount;
    }
}
