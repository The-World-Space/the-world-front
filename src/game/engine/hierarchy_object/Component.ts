import { ComponentConstructor } from "./ComponentConstructor";
import { GameObject } from "./GameObject";
import { GameStateKind } from "../GameState";
import { IEngine } from "../IEngine";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { isUpdateableComponent } from "../SceneProcessor";
import { Coroutine } from "../coroutine/Coroutine";
import { CoroutineIterator } from "../coroutine/CoroutineIterator";
import { ICoroutine } from "../coroutine/ICoroutine";

export abstract class Component {
    protected readonly _disallowMultipleComponent: boolean = false;
    protected readonly _requiredComponents: ComponentConstructor[] = [];
    protected readonly _executionOrder: number = 0;

    private _enabled: boolean;
    private _awakened: boolean;
    private _awakening: boolean;
    private _startEnqueued: boolean;
    private _started: boolean;
    private _starting: boolean;
    private _updateEnqueued: boolean;
    private _gameObject: GameObject;
    private _runningCoroutines: Coroutine[] = [];

    public constructor(gameObject: GameObject) {
        this._enabled = true;
        this._awakened = false;
        this._awakening = false;
        this._startEnqueued = false;
        this._started = false;
        this._starting = false;
        this._updateEnqueued = false;
        this._gameObject = gameObject;
    }

    //Awake is called when the script instance is being loaded.
    //The order that Unity calls each GameObject's Awake is not deterministic.
    //Because of this, you should not rely on one GameObject's Awake being called before or after another
    //(for example, you should not assume that a reference set up by one GameObject's Awake will be usable in another GameObject's Awake).
    //Instead, you should use Awake to set up references between scripts, and use Start, which is called after all Awake calls are finished, to pass any information back and forth.
    //
    //https://docs.unity3d.com/ScriptReference/MonoBehaviour.Awake.html
    protected awake(): void { }

    //Start is called on the frame when a script is enabled just before any of the Update methods are called the first time.
    //
    //https://docs.unity3d.com/ScriptReference/MonoBehaviour.Start.html
    protected start(): void { }

    public onDestroy(): void { }

    public onEnable(): void { }

    public onDisable(): void { }

    public startCorutine(coroutineIterator: CoroutineIterator): ICoroutine {
        const coroutine = new Coroutine(coroutineIterator, () => {
            const index = this._runningCoroutines.indexOf(coroutine);
            if (index >= 0) {
                this._runningCoroutines.splice(index, 1);
            }
        });
        this._runningCoroutines.push(coroutine);
        (this.engine as EngineGlobalObject).coroutineProcessor.addCoroutine(coroutine);
        return coroutine;
    }

    public stopAllCoroutines(): void {
        this._runningCoroutines.forEach(coroutine => {
            this.stopCoroutine(coroutine);
        });
        this._runningCoroutines = [];
    }

    public stopCoroutine(coroutine: ICoroutine): void {
        (this.engine as EngineGlobalObject).coroutineProcessor.removeCoroutine(coroutine as Coroutine);
        const index = this._runningCoroutines.indexOf(coroutine as Coroutine);
        if (index >= 0) {
            this._runningCoroutines.splice(index, 1);
        } else {
            throw new Error("coroutine must be stopped by started component");
        }
    }

    //this method is called by the engine, do not call it manually
    public tryCallAwake(): void {
        if (this._awakened) return;
        this._awakening = true;
        this.awake();
        this._awakening = false;
        this._awakened = true;
    }

    //this method is called by the engine, do not call it manually
    public tryCallStart(): void {
        if (this._started) return;
        this._starting = true;
        this.start();
        this._starting = false;
        this._started = true;
    }

    //this method is called by the engine, do not call it manually
    public tryEnqueueStart(): void {
        if (this._startEnqueued) return;
        (this.engine as EngineGlobalObject).sceneProcessor.addStartComponent(this);
        this._startEnqueued = true;
    }

    //this method is called by the engine, do not call it manually
    public tryEnqueueUpdate(): void {
        if (this._updateEnqueued) return;
        if (isUpdateableComponent(this)) {
            (this.engine as EngineGlobalObject).sceneProcessor.addUpdateComponent(this);
            this._updateEnqueued = true;
        }
    }

    //this method is called by the engine, do not call it manually
    public tryDequeueUpdate(): void {
        if (!this._updateEnqueued) return;
        if (isUpdateableComponent(this)) {
            (this.engine as EngineGlobalObject).sceneProcessor.removeUpdateComponent(this);
            this._updateEnqueued = false;
        }
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        if (this._enabled === value) return;

        this._enabled = value;

        if (this.engine.gameState.kind === GameStateKind.Initializing) {
            return;
        }
        
        if (this._gameObject.activeInHierarchy) {
            const sceneProcessor = (this.engine as EngineGlobalObject).sceneProcessor;

            if (this._enabled) {
                this.onEnable();
                if (!this._startEnqueued) {
                    sceneProcessor.addStartComponent(this);
                    this._startEnqueued = true;
                }
                this.tryEnqueueUpdate();
            } else {
                this.onDisable();
                if (this._startEnqueued && !this._started) {
                    sceneProcessor.removeStartComponent(this);
                    this._startEnqueued = false;
                }
                this.tryDequeueUpdate();
            }
        }
    }

    public get awakening(): boolean {
        return this._awakening;
    }

    public get awakened(): boolean {
        return this._awakened;
    }

    public get starting(): boolean {
        return this._starting;
    }

    public get started(): boolean {
        return this._started;
    }

    public get gameObject(): GameObject {
        return this._gameObject;
    }

    public get engine(): IEngine {
        return this._gameObject.engine;
    }

    public get disallowMultipleComponent(): boolean {
        return this._disallowMultipleComponent;
    }

    public get requiredComponents(): ComponentConstructor[] {
        return this._requiredComponents;
    }

    public get executionOrder(): number {
        return this._executionOrder;
    }
}
