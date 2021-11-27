import { IInputEventHandleable } from "./IInputEventhandleable";


export class InputHandler implements IInputEventHandleable {
    private _map: Map<string, boolean>;
    private _isDisposed: boolean;

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
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    public stopHandleEvents(): void {
        this._map.clear();
        window.removeEventListener("keydown", this.handleKeyDown.bind(this));
        window.removeEventListener("keyup", this.handleKeyUp.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent) {
        this._map.set(event.key, true);
    }
    
    private handleKeyUp(event: KeyboardEvent) {
        this._map.set(event.key, false);
    }
}
