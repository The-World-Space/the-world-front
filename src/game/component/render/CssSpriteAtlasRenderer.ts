import { Vector2 } from "three";
import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";

export class CssSpriteAtlasRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _sprite: CSS3DSprite|null = null;
    private _htmlImageElement: HTMLImageElement|null = null;
    private _rowCount: number = 1;
    private _columnCount: number = 1;
    private _imageWidth: number = 0;
    private _imageHeight: number = 0;
    private _imageFlipX: boolean = false;
    private _imageFlipY: boolean = false;
    private _opacity: number = 1;
    private _pointerEvents: boolean = true;
    private _croppedImageWidth: number = 0;
    private _croppedImageHeight: number = 0;
    private _currentImageIndex: number = 0;
    private readonly _imageCenterOffset: Vector2 = new Vector2(0, 0);
    private _zindex: number = 0;
    
    private _initializeFunction: (() => void)|null = null;

    private static readonly _defaultImagePath: string = "/assets/tilemap/default.png";

    protected start(): void {
        this._initializeFunction?.call(this);
        if (!this._htmlImageElement) {
            this.setImage(CssSpriteAtlasRenderer._defaultImagePath, 1, 1);
        }
        
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
    }

    public onDestroy(): void {
        if (this._sprite) this.gameObject.remove(this._sprite);
    }

    public onEnable(): void {
        if (this._sprite) this._sprite.visible = true;
    }

    public onDisable(): void {
        if (this._sprite) this._sprite.visible = false;
    }

    public onSortByZaxis(zaxis: number): void {
        this._zindex = zaxis;
        if (this._sprite) {
            this._sprite.element.style.zIndex = Math.floor(this._zindex).toString();
        }
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
        }

        this._htmlImageElement.src = path;

        const onLoad = (e: Event) => {
            const image = e.target as HTMLImageElement;
            image.removeEventListener("load", onLoad);
            this._croppedImageWidth = image.naturalWidth / this._columnCount;
            this._croppedImageHeight = image.naturalHeight / this._rowCount;
            if (this._imageWidth === 0) this._imageWidth = this._croppedImageWidth;
            if (this._imageHeight === 0) this._imageHeight = this._croppedImageHeight;
            image.alt = `${this.gameObject.name}_sprite_atlas`;
            if (!this._sprite) {
                this._sprite = new CSS3DSprite(this._htmlImageElement as HTMLImageElement);
                this._sprite.position.set(
                    this._imageWidth * this._imageCenterOffset.x,
                    this._imageHeight * this._imageCenterOffset.y, 0
                );
                this._sprite.scale.set(
                    this._imageWidth / this._croppedImageWidth,
                    this._imageHeight / this._croppedImageHeight,
                    1
                );
                this._sprite.scale.x *= this._imageFlipX ? -1 : 1;
                this._sprite.scale.y *= this._imageFlipY ? -1 : 1;
                this.gameObject.add(this._sprite);
            }
            image.style.width = `${this._croppedImageWidth}px`;
            image.style.height = `${this._croppedImageHeight}px`;
            image.style.objectFit = "none";
            image.style.imageRendering = "pixelated";
            image.style.opacity = this._opacity.toString();
            image.style.pointerEvents = this._pointerEvents ? "auto" : "none";
            image.style.zIndex = this._zindex.toString();
            this.updateImageByIndex();
        };
        this._htmlImageElement.addEventListener("load", onLoad);
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
            this._sprite.position.set(
                this._imageWidth * this._imageCenterOffset.x,
                this._imageHeight * this._imageCenterOffset.y, 0
            );
        }
    }

    public get imageWidth(): number {
        return this._imageWidth;
    }

    public set imageWidth(value: number) {
        this._imageWidth = value;
        if (this._sprite) {
            this._sprite.scale.x = this._imageWidth / this._croppedImageWidth;
        }
    }

    public get imageHeight(): number {
        return this._imageHeight;
    }

    public set imageHeight(value: number) {
        this._imageHeight = value;
        if (this._sprite) {
            this._sprite.scale.y = this._imageHeight / this._croppedImageHeight;
        }
    }

    public get imageFlipX(): boolean {
        return this._imageFlipX;
    }

    public set imageFlipX(value: boolean) {
        this._imageFlipX = value;
        if (this._sprite) {
            this._sprite.scale.x *= this._imageFlipX ? -1 : 1;
        }
    }

    public get imageFlipY(): boolean {
        return this._imageFlipY;
    }

    public set imageFlipY(value: boolean) {
        this._imageFlipY = value;
        if (this._sprite) {
            this._sprite.scale.y *= this._imageFlipY ? -1 : 1;
        }
    }

    public get opacity(): number {
        return this._opacity;
    }

    public set opacity(value: number) {
        this._opacity = value;
        if (this._htmlImageElement) {
            this._htmlImageElement.style.opacity = this._opacity.toString();
        }
    }

    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
        if (this._htmlImageElement) {
            this._htmlImageElement.style.pointerEvents = this._pointerEvents ? "auto" : "none";
        }
    }
}
