import { Vector2 } from "three";
import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";

export class CssSpriteRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _sprite: CSS3DSprite|null = null;
    private _htmlImageElement: HTMLImageElement|null = null;
    private readonly _imageCenterOffset: Vector2 = new Vector2(0, 0);
    private _zindex: number = 0;
    private _imageWidth: number = 0;
    private _imageHeight: number = 0;
    private _imageFlipX: boolean = false;
    private _imageFlipY: boolean = false;
    private _opacity: number = 1;

    private _initializeFunction: (() => void)|null = null;
    
    private static readonly _defaultImagePath: string = `/assets/tilemap/default.png`;

    protected start(): void {
        if (!this._htmlImageElement) {
            this.imagePath = CssSpriteRenderer._defaultImagePath;
        }
        
        this._initializeFunction?.call(this);
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
    }

    public onDestroy(): void {
        if (this._sprite) this.gameObject.remove(this._sprite);
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

    public set imagePath(path: string|null) {
        if (!this.started && !this.starting) {
            this._initializeFunction = () => {
                this.imagePath = path;
            };
            return;
        }

        if (!path) path = CssSpriteRenderer._defaultImagePath;

        if (!this._htmlImageElement) {
            this._htmlImageElement = new Image();
        }

        this._htmlImageElement.src = path;

        const onLoad = (e: Event) => {
            const image = e.target as HTMLImageElement;
            image.removeEventListener("load", onLoad);
            if (!this._sprite) {
                this._sprite = new CSS3DSprite(image);
                image.alt = `${this.gameObject.name}_sprite_atlas`;
                image.style.imageRendering = "pixelated";

                if (this._imageWidth === 0) this._imageWidth = image.width;
                if (this._imageHeight === 0) this._imageHeight = image.height;
                image.style.width = `${this._imageWidth}px`;
                image.style.height = `${this._imageHeight}px`;
                image.style.opacity = this._opacity.toString();
                image.style.zIndex = Math.floor(this._zindex).toString();
                this._sprite.position.set(
                    this._imageWidth * this._imageCenterOffset.x,
                    this._imageHeight * this._imageCenterOffset.y, 0
                );
                this._sprite.scale.x = this._imageFlipX ? -1 : 1;
                this._sprite.scale.y = this._imageFlipY ? -1 : 1;
                this.gameObject.add(this._sprite);
            }
        };
        this._htmlImageElement.addEventListener("load", onLoad);
    }
    
    public get imageCenterOffset(): Vector2 {
        return this._imageCenterOffset.clone();
    }

    public set imageCenterOffset(value: Vector2) {
        this._imageCenterOffset.copy(value);
        if (this._sprite) {
            this._sprite.position.set(
                this._imageWidth * this._imageCenterOffset.x,
                this._imageWidth * this._imageCenterOffset.y, 0
            );
        }
    }

    public get imageWidth(): number {
        return this._imageWidth;
    }

    public set imageWidth(value: number) {
        this._imageWidth = value;
        if (this._htmlImageElement) {
            this._htmlImageElement.style.width = `${value}px`;
        }
    }

    public get imageHeight(): number {
        return this._imageHeight;
    }

    public set imageHeight(value: number) {
        this._imageHeight = value;
        if (this._sprite) {
            this._sprite.element.style.height = `${value}px`;
        }
    }

    public get imageFlipX(): boolean {
        return this._imageFlipX;
    }

    public set imageFlipX(value: boolean) {
        this._imageFlipX = value;
        if (this._sprite) {
            this._sprite.scale.x = this._imageFlipX ? -1 : 1;
        }
    }

    public get imageFlipY(): boolean {
        return this._imageFlipY;
    }

    public set imageFlipY(value: boolean) {
        this._imageFlipY = value;
        if (this._sprite) {
            this._sprite.scale.y = this._imageFlipY ? -1 : 1;
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
}
