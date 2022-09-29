import { Component, Coroutine, CoroutineIterator } from "the-world-engine";
import { PlayerNetworker } from "../networker/PlayerNetworker";

export class InputDebounceHandler extends Component {
    private _lastEvent: KeyboardEvent|null = null;
    private _debounceCoroutine: Coroutine|null = null;
    private _lefttime = 0;
    private _networkManager: PlayerNetworker|null = null;

    public onEnable(): void {
        this.engine.input.onKeyDown.addListener(this.onKeyDown);
    }

    public onDisable(): void {
        this.engine.input.onKeyDown.removeListener(this.onKeyDown);
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        this._lastEvent = event;
        this._lefttime = 0.2;
        if (!this._debounceCoroutine) {
            this._debounceCoroutine = this.startCoroutine(this.debounceInput());
        }
    };

    private *debounceInput(): CoroutineIterator {
        yield null;
        while (this._lefttime > 0) {
            this._lefttime -= this.engine.time.deltaTime;
            yield null;
        }
        if (this._lastEvent) {
            console.log(
                this._lastEvent.key,
                this._lastEvent.ctrlKey,
                this._lastEvent.altKey,
                this._lastEvent.shiftKey,
                this._lastEvent.metaKey
            );
            // TODO: send to network manager
            this._lastEvent = null;
        }
        this._debounceCoroutine = null;
    }

    public get networkManager(): PlayerNetworker|null {
        return this._networkManager;
    }

    public set networkManager(networkManager: PlayerNetworker|null) {
        this._networkManager = networkManager;
    }
}
