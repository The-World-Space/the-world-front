import { Component, ComponentConstructor, CssSpriteRenderer } from "the-world-engine";

export class EditorViewObjectController extends Component {
    public readonly disallowMultipleComponent: boolean = true;
    public readonly requiredComponents: ComponentConstructor[] = [CssSpriteRenderer];

    private _spriteRenderer: CssSpriteRenderer|null = null;
    private _gridCellWidth = 1;
    private _gridCellHeight = 1;

    protected awake(): void {
        this._spriteRenderer = this.gameObject.getComponent(CssSpriteRenderer);
    }

    public setViewObject(src: string, width: number, height: number): void {
        if (this._spriteRenderer) {
            this._spriteRenderer.enabled = true;
            this._spriteRenderer.asyncSetImageFromPath(src, () => {
                this._spriteRenderer!.imageWidth = width * this._gridCellWidth;
                this._spriteRenderer!.imageHeight = height * this._gridCellHeight;
            });
        }
    }

    public setViewObjectSize(width: number, height: number): void {
        if (this._spriteRenderer) {
            this._spriteRenderer.imageWidth = width * this._gridCellWidth;
            this._spriteRenderer.imageHeight = height * this._gridCellHeight;
        }
    }

    public clearViewObject(): void {
        if (this._spriteRenderer) {
            this._spriteRenderer.enabled = false;
        }
    }

    public setGridCellSize(width: number, height: number): void {
        this._gridCellWidth = width;
        this._gridCellHeight = height;
    }
}
