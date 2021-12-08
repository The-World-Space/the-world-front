import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { IBootstrapper } from "./bootstrap/IBootstrapper";
import { CameraContainer } from "./render/CameraContainer";
import { GameManager } from "./GameManager";
import { GameState, GameStateKind } from "./GameState";
import { GameObject } from "./hierarchy_object/GameObject";
import { Scene } from "./hierarchy_object/Scene";
import { IInputEventHandleable } from "./input/IInputEventHandleable";
import { SceneProcessor } from "./SceneProcessor";
import { Time } from "./time/Time";
import { GameScreen } from "./render/GameScreen";

export class Game {
    private readonly _rootScene: Scene;
    private readonly _cameraContainer: CameraContainer;
    private readonly _gameScreen: GameScreen;
    private readonly _renderer: CSS3DRenderer;
    private readonly _clock: THREE.Clock;
    private readonly _time: Time;
    private readonly _gameState: GameState;
    private readonly _gameManager: GameManager;
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
        this._gameManager = new GameManager(this._rootScene, this._cameraContainer, this._time, this._gameState, this._gameScreen);
        this._animationFrameId = null;
        this._isDisposed = false;
        container.appendChild(this._renderer.domElement);
    }

    public resizeFramebuffer(width: number, height: number): void {
        this._gameScreen.resize(width, height);
        this._renderer.setSize(width, height);
    }

    public run(bootstrapper: IBootstrapper): void {
        if (this._isDisposed) throw new Error("Game is disposed.");
        this._gameState.kind = GameStateKind.Initializing;
        this._clock.start();
        const sceneBuilder = bootstrapper.run(this._rootScene, this._gameManager);
        sceneBuilder.build();
        sceneBuilder.initialize();
        this._gameState.kind = GameStateKind.Running;
        SceneProcessor.init(this._rootScene);
        //If a camera exists in the bootstrapper,
        //it is certain that the camera exists in the global variable from this point on.
        if (!this._cameraContainer.camera) throw new Error("Camera is not exist.");
        SceneProcessor.update(this._rootScene);
        this._time.deltaTime = this._clock.getDelta();
        if (!this._cameraContainer.camera) throw new Error("Camera is not exist.");
        this._renderer.render(this._rootScene, this._cameraContainer.camera);
        this.loop();
    }

    private loop(): void {
        this._animationFrameId = requestAnimationFrame(this.loop.bind(this));
        SceneProcessor.update(this._rootScene);
        this._time.deltaTime = this._clock.getDelta();
        if (!this._cameraContainer.camera) throw new Error("Camera is not exist.");
        this._renderer.render(this._rootScene, this._cameraContainer.camera);
    }

    public dispose(): void {
        this._gameState.kind = GameStateKind.Finalizing;
        if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
        this._gameManager.dispose();
        this._rootScene.children.forEach(child => {
            if (child instanceof GameObject) child.destroy();
        });
        this._container.removeChild(this._renderer.domElement);
        this._isDisposed = true;
        this._gameState.kind = GameStateKind.Finalized;
    }

    public get inputHandler(): IInputEventHandleable {
        return this._gameManager.inputHandler;
    }
}
