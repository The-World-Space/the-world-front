import { Vector2, Vector3 } from "three/src/Three";
import {
    Component,
    ComponentConstructor,
    GameObject,
    PrefabRef,
    CssSpriteAtlasRenderer,
    PointerGridEvent,
    PointerGridInputListener
} from "the-world-engine";

export class GridBrush extends Component {
    public readonly disallowMultipleComponent: boolean = true;
    public readonly requiredComponents: ComponentConstructor[] = [PointerGridInputListener];
    
    private _gridInputListener: PointerGridInputListener|null = null;
    private _pointerDown = false;
    private _pointerHover = false;
    private _showImage = false;
    private _pointerImage: CssSpriteAtlasRenderer|null = null;
    private _pointerImageObject: GameObject|null = null;
    private _imageZoffset = 0;
    private _onDraw: ((gridPosition: Vector2) => void)|null = null;

    private readonly _onPointerDownBind = this.onPointerDown.bind(this);
    private readonly _onPointerUpBind = this.onPointerUp.bind(this);
    private readonly _onPointerMoveBind = this.onPointerMove.bind(this);
    private readonly _onPointerEnterBind = this.onPointerEnter.bind(this);
    private readonly _onPointerLeaveBind = this.onPointerLeave.bind(this);

    protected awake(): void {
        this._gridInputListener = this.gameObject.getComponent(PointerGridInputListener);
    }

    protected start(): void {
        const pointerImageRef = new PrefabRef<CssSpriteAtlasRenderer>();
        const pointerImageObjectRef = new PrefabRef<GameObject>();

        this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildGameObject("pointer_image", new Vector3(0, 0, this._imageZoffset))
                .active(false)
                .withComponent(CssSpriteAtlasRenderer, c => {
                    c.centerOffset = new Vector2(0.5, 0.5);
                    c.opacity = 0.5;
                    c.pointerEvents = false;
                    c.viewScale = 1;
                })
                .getComponent(CssSpriteAtlasRenderer, pointerImageRef)
                .getGameObject(pointerImageObjectRef));
        
        this._pointerImage = pointerImageRef.ref;
        this._pointerImageObject = pointerImageObjectRef.ref;
    }

    public onEnable(): void {
        if (!this._gridInputListener) throw new Error("Unreachable");
        this._gridInputListener.onPointerDown.addListener(this._onPointerDownBind);
        this._gridInputListener.onPointerUp.addListener(this._onPointerUpBind);
        this._gridInputListener.onPointerMove.addListener(this._onPointerMoveBind);
        this._gridInputListener.onPointerEnter.addListener(this._onPointerEnterBind);
        this._gridInputListener.onPointerLeave.addListener(this._onPointerLeaveBind);
    }

    public onDisable(): void {
        if (this._gridInputListener) {
            this._gridInputListener.onPointerDown.removeListener(this._onPointerDownBind);
            this._gridInputListener.onPointerUp.removeListener(this._onPointerUpBind);
            this._gridInputListener.onPointerMove.removeListener(this._onPointerMoveBind);
            this._gridInputListener.onPointerEnter.removeListener(this._onPointerEnterBind);
            this._gridInputListener.onPointerLeave.removeListener(this._onPointerLeaveBind);
        }
    }

    private readonly _lastGridPosition = new Vector2();

    private onPointerDown(event: PointerGridEvent) {
        this._pointerDown = true;
        this._lastGridPosition.copy(event.gridPosition);
        this.updateImagePosition(event.gridPosition);
        this._onDraw?.(event.gridPosition);
    }

    private onPointerUp() {
        this._pointerDown = false;
    }

    private onPointerMove(event: PointerGridEvent) {
        if (this._lastGridPosition.equals(event.gridPosition)) return;
        this._lastGridPosition.copy(event.gridPosition);
        this.updateImagePosition(event.gridPosition);
        if (!this._pointerDown) return;
        this._onDraw?.(event.gridPosition);
    }

    private onPointerEnter(event: PointerGridEvent) {
        this._pointerHover = true;
        this.updateImagePosition(event.gridPosition);
        this.updateImageShow();
    }

    private onPointerLeave() {
        this._pointerHover = false;
        this._pointerDown = false;
        this.updateImageShow();
    }

    private updateImagePosition(gridPosition: Vector2): void {
        if (!this._pointerImageObject) return;
        if (!this._gridInputListener) return;
        this._pointerImageObject.transform.localPosition.x = gridPosition.x * this._gridInputListener.gridCellWidth;
        this._pointerImageObject.transform.localPosition.y = gridPosition.y * this._gridInputListener.gridCellHeight;
    }

    public updateImageShow(): void {
        if (!this._pointerImageObject) return;
        if (this._pointerHover && this._showImage) {
            this._pointerImageObject.activeSelf = true;
        } else {
            this._pointerImageObject.activeSelf = false;
        }
    }
    
    public get onDraw(): ((gridPosition: Vector2) => void)|null {
        return this._onDraw;
    }

    public set onDraw(value: ((gridPosition: Vector2) => void)|null) {
        this._onDraw = value;
    }

    public setImage(src: string, width: number, height: number): void {
        if (!this._pointerImageObject) return;
        if (!this._pointerImage) return;
        this._showImage = true;
        this.updateImageShow();
        this._pointerImage.asyncSetImageFromPath(src, 1, 1, () => {
            this._pointerImage!.imageIndex = 0;
            this._pointerImage!.imageWidth = width;
            this._pointerImage!.imageHeight = height;
        });
    }
    
    public setImageFromAtlas(
        src: string,
        rowCount: number,
        columnCount: number,
        atlasIndex: number,
        width: number,
        height: number
    ): void {
        if (!this._pointerImageObject) return;
        if (!this._pointerImage) return;
        this._showImage = true;
        this.updateImageShow();
        this._pointerImage.asyncSetImageFromPath(src, columnCount, rowCount, () => {
            this._pointerImage!.imageIndex = atlasIndex;
            this._pointerImage!.imageWidth = width;
            this._pointerImage!.imageHeight = height;
        });
    }

    public setImageOffset(x: number, y: number): void {
        if (!this._pointerImage) return;
        this._pointerImage.centerOffset = new Vector2(x, y);
    }

    public setImageWidth(width: number): void {
        if (!this._pointerImage) return;
        this._pointerImage.imageWidth = width;
    }

    public setImageHeight(height: number): void {
        if (!this._pointerImage) return;
        this._pointerImage.imageHeight = height;
    }

    public setAtlasIndex(index: number): void {
        if (!this._pointerImage) return;
        this._pointerImage.imageIndex = index;
    }

    public clearImage(): void {
        this._showImage = false;
        this.updateImageShow();
    }

    public get gridCellWidth(): number|null {
        if (!this._gridInputListener) return null;
        return this._gridInputListener.gridCellWidth;
    }

    public get gridCellHeight(): number|null {
        if (!this._gridInputListener) return null;
        return this._gridInputListener.gridCellHeight;
    }

    public get imageZoffset(): number {
        return this._imageZoffset;
    }

    public set imageZoffset(value: number) {
        this._imageZoffset = value;
    }
}
