import { Component } from "../../engine/hierarchy_object/Component";
import { ComponentConstructor } from "../../engine/hierarchy_object/ComponentConstructor";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";

export class EditorViewObjectController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [CssSpriteRenderer];

    private _spriteRenderer: CssSpriteRenderer|null = null;
    private _gridCellWidth: number = 16;
    private _gridCellHeight: number = 16;

    protected awake(): void {
        this._spriteRenderer = this.gameObject.getComponent(CssSpriteRenderer);
    }

    public setViewObject(src: string, width: number, height: number): void {
        if (this._spriteRenderer) {
            this._spriteRenderer.enabled = true;
            this._spriteRenderer.asyncSetImagePath(src, () => {
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
