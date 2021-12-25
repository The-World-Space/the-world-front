import { Vector2, Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { ComponentConstructor } from "../../engine/hierarchy_object/ComponentConstructor";
import { Camera } from "../render/Camera";

export class EditorCameraController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [Camera];

    private _camera: Camera|null = null;
    private _mouseMiddleDown: boolean = false;
    private readonly _lastOffset: Vector2 = new Vector2();
    private _minViewSize: number = 30;
    private _maxViewSize: number = 100;
    private _defaultViewSize: number = 200;
    private readonly _defaultPosition = new Vector3();
    private _onKeyDownBind = this.onKeyDown.bind(this);
    private _onWheelBind = this.onWheel.bind(this);
    private _onPointerDownBind = this.onPointerDown.bind(this);
    private _onPointerUpBind = this.onPointerUp.bind(this);
    private _onPointerMoveBind = this.onPointerMove.bind(this);
    private _onPointerLeaveBind = this.onPointerLeave.bind(this);

    protected awake(): void {
        this._camera = this.gameObject.getComponent(Camera);
        this._defaultViewSize = this._camera!.viewSize;
        this._defaultPosition.copy(this.gameObject.transform.position);
    }

    public onEnable(): void {
        const input = this.engine.input;
        input.addOnKeyDownEventListener(this._onKeyDownBind);
        input.addOnWheelEventListener(this._onWheelBind);
        input.addOnPointerDownEventListener(this._onPointerDownBind);
        input.addOnPointerUpEventListener(this._onPointerUpBind);
        input.addOnPointerMoveEventListener(this._onPointerMoveBind);
        input.addOnPointerLeaveEventListener(this._onPointerLeaveBind);
    }

    public onDisable(): void {
        const input = this.engine.input;
        input.removeOnKeyDownEventListener(this._onKeyDownBind);
        input.removeOnWheelEventListener(this._onWheelBind);
        input.removeOnPointerDownEventListener(this._onPointerDownBind);
        input.removeOnPointerUpEventListener(this._onPointerUpBind);
        input.removeOnPointerMoveEventListener(this._onPointerMoveBind);
        input.removeOnPointerLeaveEventListener(this._onPointerLeaveBind);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.key === " ") {
            this._camera!.viewSize = this._defaultViewSize;
            this.gameObject.transform.position.copy(this._defaultPosition);
        }
    }

    private onWheel(event: WheelEvent): void {
        this._camera!.viewSize += event.deltaY * 0.1;
        if (this._camera!.viewSize < this._minViewSize) {
            this._camera!.viewSize = this._minViewSize;
        } else if (this._camera!.viewSize > this._maxViewSize) {
            this._camera!.viewSize = this._maxViewSize;
        }
    }

    private onPointerDown(event: MouseEvent): void {
        this._lastOffset.set(
            event.clientX / this.engine.screen.width,
            event.clientY / this.engine.screen.height
        );
        if (event.button === 1) {
            this._mouseMiddleDown = true;
        }
    }

    private onPointerUp(event: MouseEvent): void {
        if (event.button === 1) {
            this._mouseMiddleDown = false;
        }
    }

    private onPointerLeave(event: MouseEvent): void {
        this._mouseMiddleDown = false;
    }

    private onPointerMove(event: MouseEvent): void {
        if (!this._mouseMiddleDown) return;

        const clientOffsetX = event.clientX / this.engine.screen.width;
        const clientOffsetY = event.clientY / this.engine.screen.height;

        const clientXdiff = clientOffsetX - this._lastOffset.x;
        const clientYdiff = clientOffsetY - this._lastOffset.y;

        this.gameObject.transform.position.x -= clientXdiff * this._camera!.viewSize;
        this.gameObject.transform.position.y += clientYdiff * this._camera!.viewSize;

        this._lastOffset.set(clientOffsetX, clientOffsetY);
    }

    public get minViewSize(): number {
        return this._minViewSize;
    }

    public set minViewSize(value: number) {
        this._minViewSize = value;

        if (this._camera!.viewSize < this._minViewSize) {
            this._camera!.viewSize = this._minViewSize;
        }
    }

    public get maxViewSize(): number {
        return this._maxViewSize;
    }

    public set maxViewSize(value: number) {
        this._maxViewSize = value;

        if (this._camera!.viewSize > this._maxViewSize) {
            this._camera!.viewSize = this._maxViewSize;
        }
    }
}
