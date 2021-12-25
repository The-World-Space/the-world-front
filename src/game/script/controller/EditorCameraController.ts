import { Vector2 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { ComponentConstructor } from "../../engine/hierarchy_object/ComponentConstructor";
import { Camera } from "../render/Camera";

export class EditorCameraController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [Camera];

    private _camera: Camera|null = null;
    private _mouseMiddleDown: boolean = false;
    private readonly _lastOffset: Vector2 = new Vector2();
    private _onWheelBind = this.onWheel.bind(this);
    private _onPointerDownBind = this.onPointerDown.bind(this);
    private _onPointerUpBind = this.onPointerUp.bind(this);
    private _onPointerMoveBind = this.onPointerMove.bind(this);
    private _onPointerLeaveBind = this.onPointerLeave.bind(this);

    protected awake(): void {
        this._camera = this.gameObject.getComponent(Camera);
    }

    public onEnable(): void {
        this.engine.input.addOnWheelEventListener(this._onWheelBind);
        this.engine.input.addOnPointerDownEventListener(this._onPointerDownBind);
        this.engine.input.addOnPointerUpEventListener(this._onPointerUpBind);
        this.engine.input.addOnPointerMoveEventListener(this._onPointerMoveBind);
        this.engine.input.addOnPointerLeaveEventListener(this._onPointerLeaveBind);
    }

    public onDisable(): void {
        this.engine.input.removeOnWheelEventListener(this._onWheelBind);
        this.engine.input.removeOnPointerDownEventListener(this._onPointerDownBind);
        this.engine.input.removeOnPointerUpEventListener(this._onPointerUpBind);
        this.engine.input.removeOnPointerMoveEventListener(this._onPointerMoveBind);
        this.engine.input.removeOnPointerLeaveEventListener(this._onPointerLeaveBind);
    }

    private onWheel(event: WheelEvent): void {
        this._camera!.viewSize += event.deltaY * 0.1;
        if (this._camera!.viewSize < 0.1) {
            this._camera!.viewSize = 0.1;
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
}
