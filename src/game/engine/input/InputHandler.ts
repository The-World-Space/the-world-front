import { IInputEventHandleable } from "./IInputEventHandleable";

export class InputHandler implements IInputEventHandleable {
    private _map: Map<string, boolean>;
    private _isDisposed: boolean;
    private _onWheelDelegates: ((event: WheelEvent) => void)[] = [];

    private readonly _handleKeyDownBind = this.handleKeyDown.bind(this);
    private readonly _handleKeyUpBind = this.handleKeyUp.bind(this);
    private readonly _handleWheelBind = this.handleWheel.bind(this);

    public constructor() {
        this._map = new Map<string, boolean>();
        this._isDisposed = false;
    }

    public get map(): Map<string, boolean> {
        return this._map;
    }

    public dispose(): void {
        this.stopHandleEvents();
        this._isDisposed = true;
    }

    public startHandleEvents(): void {
        if (this._isDisposed) {
            throw new Error("InputHandler is disposed.");
        }
        window.addEventListener("keydown", this._handleKeyDownBind);
        window.addEventListener("keyup", this._handleKeyUpBind);
        window.addEventListener("wheel", this._handleWheelBind);
    }

    public stopHandleEvents(): void {
        this._map.clear();
        window.removeEventListener("keydown", this._handleKeyDownBind);
        window.removeEventListener("keyup", this._handleKeyUpBind);
        window.removeEventListener("wheel", this._handleWheelBind);
    }

    private handleKeyDown(event: KeyboardEvent) {
        this._map.set(event.key, true);
    }
    
    private handleKeyUp(event: KeyboardEvent) {
        this._map.set(event.key, false);
    }

    private handleWheel(event: WheelEvent): void {
        this._onWheelDelegates.forEach(delegate => delegate(event));
    }

    public addOnWheelEventListener(delegate: (event: WheelEvent) => void): void {
        this._onWheelDelegates.push(delegate);
    }

    public removeOnWheelEventListener(delegate: (event: WheelEvent) => void): void {
        const index = this._onWheelDelegates.indexOf(delegate);
        if (index === -1) return;
        this._onWheelDelegates.splice(index, 1);
    }
}
