export class InputHandler {
    private _input: Map<string, boolean>;

    public constructor() {
        this._input = new Map<string, boolean>();
    }

    public get input(): Map<string, boolean> {
        return this._input;
    }

    public startHandleEvents(): void {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    public stopHandleEvents(): void {
        window.removeEventListener("keydown", this.handleKeyDown.bind(this));
        window.removeEventListener("keyup", this.handleKeyUp.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent) {
        
        throw new Error("Method not implemented.");
    }
    
    private handleKeyUp(event: KeyboardEvent) {
        throw new Error("Method not implemented.");
    }

    public dispose(): void {
    }
}