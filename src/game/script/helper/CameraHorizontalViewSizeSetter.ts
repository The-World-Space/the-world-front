import { Camera, Component } from "the-world-engine";

export class CameraHorizontalViewSizeSetter extends Component {
    public override readonly requiredComponents = [Camera];
    public override readonly disallowMultipleComponent = true;

    private _viewSize: number = 1;
    private _camera: Camera|null = null;

    public awake(): void {
        this._camera = this.gameObject.getComponent(Camera);
        this.update();
        this.updateViewSize();
    }

    public update(): void {
        const screen = this.engine.screen;
        const aspect = screen.width / screen.height;
        const horizontalViewSize = this._camera!.viewSize * aspect;
        this._viewSize = horizontalViewSize;
    }

    public onEnable(): void {
        this.engine.screen.onResize.addListener(this.onScreenResize);
    }

    public onDisable(): void {
        this.engine.screen.onResize.removeListener(this.onScreenResize);
    }

    private readonly onScreenResize = (): void => {
        this.updateViewSize();
    };

    private updateViewSize(): void {
        if (!this._camera) return;
        const horizontalViewSize = this._viewSize;
        const screen = this.engine.screen;
        const aspect = screen.width / screen.height;
        const verticalViewSize = horizontalViewSize / aspect;
        this._camera.viewSize = verticalViewSize;
    }

    public get viewSize(): number {
        return this._viewSize;
    }

    public set viewSize(value: number) {
        this._viewSize = value;
        this.updateViewSize();
    }
}