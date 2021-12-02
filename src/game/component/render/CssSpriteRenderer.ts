import { Vector2 } from "three";
import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../engine/hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";

export class CssSpriteRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _sprite: CSS3DSprite|null = null;
    private _htmlImageElement: HTMLImageElement|null = null;
    private _imageCenterOffset: Vector2 = new Vector2(0, 0);
    private _zindex: number = 0;

    private _initializeFunction: (() => void)|null = null;
    
    private static readonly _defaultImagePath: string = `${process.env.PUBLIC_URL}/assets/tilemap/default.png`;

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
                image.style.zIndex = Math.floor(this._zindex).toString();
                this._sprite.position.set(
                    image.naturalWidth * this._imageCenterOffset.x,
                    image.naturalHeight * this._imageCenterOffset.y, 0
                );
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
                this._htmlImageElement!.naturalWidth * this._imageCenterOffset.x,
                this._htmlImageElement!.naturalHeight * this._imageCenterOffset.y, 0
            );
        }
    }
}
