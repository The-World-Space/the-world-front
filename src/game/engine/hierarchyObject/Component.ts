import { ComponentConstructor } from "./ComponentConstructor";
import { GameManager } from "../GameManager";
import { GameObject } from "./GameObject";
import { GameStateKind } from "../GameState";

export abstract class Component {
    protected readonly _disallowMultipleComponent: boolean = false;
    protected readonly _requiredComponents: ComponentConstructor[] = [];

    private _enabled: boolean;
    private _started: boolean;
    protected _gameObject: GameObject;

    public constructor(gameObject: GameObject) {
        this._enabled = true;
        this._started = false;
        this._gameObject = gameObject;
    }

    public start(): void { }

    public update(): void { }

    public onDestroy(): void { }

    public onEnable(): void { }

    public onDisable(): void { }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        if (this._enabled === value) return;

        this._enabled = value;

        if (this.gameManager.gameState.kind === GameStateKind.Initializing) {
            return;
        }
        
        if (this._gameObject.activeInHierarchy) {
            if (this._enabled) {
                this.onEnable();
                if (!this._started) {
                    this.start();
                    this._started = true;
                }
            } else this.onDisable();
        }
    }

    public get gameManager(): GameManager {
        return this._gameObject.gameManager;
    }

    public get disallowMultipleComponent(): boolean {
        return this._disallowMultipleComponent;
    }

    public get requiredComponents(): ComponentConstructor[] {
        return this._requiredComponents;
    }
}
