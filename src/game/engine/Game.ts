import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Bootstrapper } from "./bootstrap/Bootstrapper";
import { CameraContainer } from "./render/CameraContainer";
import { EngineGlobalObject } from "./EngineGlobalObject";
import { GameState, GameStateKind } from "./GameState";
import { Scene } from "./hierarchy_object/Scene";
import { IInputEventHandleable } from "./input/IInputEventHandleable";
import { SceneProcessor } from "./SceneProcessor";
import { Time } from "./time/Time";
import { GameScreen } from "./render/GameScreen";
import { BootstrapperConstructor } from "./bootstrap/BootstrapperConstructor";
import { Transform } from "./hierarchy_object/Transform";
import { CoroutineProcessor } from "./coroutine/CoroutineProcessor";

export class Game {
    private readonly _rootScene: Scene;
    private readonly _cameraContainer: CameraContainer;
    private readonly _gameScreen: GameScreen;
    private readonly _renderer: CSS3DRenderer;
    private readonly _clock: THREE.Clock;
    private readonly _time: Time;
    private readonly _gameState: GameState;
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _coroutineProcessor: CoroutineProcessor;
    private readonly _engineGlobalObject: EngineGlobalObject;
    private readonly _container: HTMLElement;
    private _animationFrameId: number|null;
    private _isDisposed: boolean;

    public constructor(container: HTMLElement, screenWidth: number, screenHeight: number) {
        this._rootScene = new Scene();
        this._cameraContainer = new CameraContainer();
        this._gameScreen = new GameScreen(screenWidth, screenHeight);
        this._container = container;
        this._renderer = new CSS3DRenderer();
        this._renderer.setSize(screenWidth, screenHeight);
        this._clock = new THREE.Clock();
        this._time = new Time();
        this._gameState = new GameState(GameStateKind.WaitingForStart);
        this._sceneProcessor = new SceneProcessor();
        this._coroutineProcessor = new CoroutineProcessor(this._time);
        this._engineGlobalObject = new EngineGlobalObject(
            this._rootScene,
            this._cameraContainer,
            this._time,
            this._gameState,
            this._gameScreen,
            this._sceneProcessor,
            this._coroutineProcessor
        );
        this._animationFrameId = null;
        this._isDisposed = false;
        container.appendChild(this._renderer.domElement);
        this._renderer.domElement.onscroll = () => {
            this._renderer.domElement.scrollLeft = 0;
            this._renderer.domElement.scrollTop = 0;
        };
    }

    public resizeFramebuffer(width: number, height: number): void {
        this._gameScreen.resize(width, height);
        this._renderer.setSize(width, height);
    }

    public run<T, U extends Bootstrapper<T> = Bootstrapper<T>>(bootstrapperCtor: BootstrapperConstructor<T, U>, interopObject?: T): void {
        if (this._isDisposed) throw new Error("Game is disposed.");
        this._gameState.kind = GameStateKind.Initializing;
        this._clock.start();
        this._time.startTime = this._clock.startTime;
        const bootstrapper = new bootstrapperCtor(this._engineGlobalObject, interopObject);
        const sceneBuilder = bootstrapper.run();
        const componentsInScene = sceneBuilder.build();
        this._sceneProcessor.init(componentsInScene);
        //If a camera exists in the bootstrapper,
        //it is certain that the camera exists in the global variable from this point on.
        if (!this._cameraContainer.camera) throw new Error("Camera is not exist in the scene.");
        this._gameState.kind = GameStateKind.Running;
        this._sceneProcessor.update();
        this._coroutineProcessor.updateAfterProcess();
        if (!this._cameraContainer.camera) throw new Error("Camera is not exist in the scene.");
        this._renderer.render(this._rootScene, this._cameraContainer.camera);
        this._coroutineProcessor.endFrameAfterProcess();
        this.loop();
    }

    private loop(): void {
        this._animationFrameId = requestAnimationFrame(this.loop.bind(this));
        this._time.deltaTime = this._clock.getDelta(); //order is matter.
        this._time.elapsedTime = this._clock.elapsedTime; //order is matter.
        this._sceneProcessor.update();
        this._coroutineProcessor.tryCompact();
        this._coroutineProcessor.updateAfterProcess();
        if (!this._cameraContainer.camera) throw new Error("Camera is not exist.");
        this._renderer.render(this._rootScene, this._cameraContainer.camera);
        this._coroutineProcessor.endFrameAfterProcess();
    }

    public dispose(): void {
        this._gameState.kind = GameStateKind.Finalizing;
        if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
        this._engineGlobalObject.dispose();
        this._rootScene.children.slice().forEach(child => {
            if (child instanceof Transform) child.gameObject.destroy();
        });
        this._container.removeChild(this._renderer.domElement);
        this._isDisposed = true;
        this._gameState.kind = GameStateKind.Finalized;
    }

    public get inputHandler(): IInputEventHandleable {
        return this._engineGlobalObject.inputHandler;
    }
}
