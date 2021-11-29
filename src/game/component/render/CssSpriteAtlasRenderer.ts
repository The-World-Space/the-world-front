import { Vector2 } from "three";
import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchyObject/Component";

export class CssSpriteAtlasRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _sprite: CSS3DSprite|null = null;
    private _htmlImageElement: HTMLImageElement|null = null;
    private _rowCount: number = 1;
    private _columnCount: number = 1;
    private _croppedImageWidth: number = 0;
    private _croppedImageHeight: number = 0;
    private _currentImageIndex: number = 0;
    private _imageCenterOffset: Vector2 = new Vector2(0, 0);
    
    private _initializeFunction: (() => void)|null = null;

    private static readonly _defaultImagePath: string = `${process.env.PUBLIC_URL}/assets/tilemap/default.png`;

    protected start(): void {
        if (!this._htmlImageElement) {
            this.setImage(CssSpriteAtlasRenderer._defaultImagePath, 1, 1);
        }

        this._initializeFunction?.call(this);
    }

    public onDestroy(): void {
        if (this._sprite) this._gameObject.remove(this._sprite);
    }

    public onEnable(): void {
        if (this._sprite) this._sprite.visible = true;
    }

    public onDisable(): void {
        if (this._sprite) this._sprite.visible = false;
    }

    public get imagePath(): string|null {
        return this._htmlImageElement?.src || null;
    }

    public setImage(path: string, rowCount: number, columnCount: number): void {
        if (!this.started && !this.starting) {
            this._initializeFunction = () => {
                this.setImage(path, rowCount, columnCount);
            };
            return;
        }

        this._rowCount = rowCount;
        this._columnCount = columnCount;

        if (!this._htmlImageElement) {
            this._htmlImageElement = new Image();
            this._htmlImageElement.style.imageRendering = "pixelated";
        }

        this._htmlImageElement.src = path;

        this._htmlImageElement.onload = e => {
            const image = e.target as HTMLImageElement;
            this._croppedImageWidth = image.naturalWidth / this._columnCount;
            this._croppedImageHeight = image.naturalHeight / this._rowCount;
            image.style.width = `${this._croppedImageWidth}px`;
            image.style.height = `${this._croppedImageHeight}px`;
            image.style.objectFit = "none";
            image.style.translate = `${this._imageCenterOffset.x}% ${this._imageCenterOffset.y}% 0px`;
            if (!this._sprite) {
                this._sprite = new CSS3DSprite(this._htmlImageElement as HTMLImageElement);
                this._gameObject.add(this._sprite);
            }
            this.updateImageByIndex();
        };
    }

    private updateImageByIndex(): void {
        if (this._sprite) {
            const width = -(this._currentImageIndex % this._columnCount * this._croppedImageWidth);
            const height = -Math.floor(this._currentImageIndex / this._columnCount) * this._croppedImageHeight;
            this._sprite.element.style.objectPosition = `${width}px ${height}px`;
        }
    }

    public set imageIndex(value: number) {
        this._currentImageIndex = value;
        this.updateImageByIndex();
    }

    public get rowCount(): number {
        return this._rowCount;
    }

    public get columnCount(): number {
        return this._columnCount;
    }

    public get imageCenterOffset(): Vector2 {
        return this._imageCenterOffset.clone();
    }

    public set imageCenterOffset(value: Vector2) {
        this._imageCenterOffset.copy(value);
        if (this._sprite) {
            this._sprite.element.style.translate = `${this._imageCenterOffset.x}% ${this._imageCenterOffset.y}% 0px`;
        }
    }
}
