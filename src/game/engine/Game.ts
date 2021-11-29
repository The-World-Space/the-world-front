import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { IBootstrapper } from "./bootstrap/IBootstrapper";
import { GameManager } from "./GameManager";
import { GameState, GameStateKind } from "./GameState";
import { GameObject } from "./hierarchyObject/GameObject";
import { IInputEventHandleable } from "./IInputEventHandleable";
import { SceneProcessor } from "./SceneProcessor";
import { Time } from "./Time";

export class Game {
    private readonly _rootScene: THREE.Scene;
    private readonly _camera: THREE.OrthographicCamera;
    private readonly _renderer: CSS3DRenderer;
    private readonly _clock: THREE.Clock;
    private readonly _time: Time;
    private readonly _gameState: GameState;
    private readonly _gameManager: GameManager;
    private readonly _container: HTMLElement;
    private _animationFrameId: number | null;
    private _isDisposed: boolean;

    private static readonly _cameraViewSize = 200;

    public constructor(container: HTMLElement, screenWidth: number, screenHeight: number) {
        this._rootScene = new THREE.Scene();

        const aspectRatio = screenWidth / screenHeight;
        const viewSizeScalar = Game._cameraViewSize * 0.5;
        this._camera = new THREE.OrthographicCamera(
            -viewSizeScalar * aspectRatio,
            viewSizeScalar * aspectRatio,
            viewSizeScalar,
            -viewSizeScalar,
            0.1,
            1000
        );

        this._container = container;
        this._renderer = new CSS3DRenderer();
        this._renderer.setSize(screenWidth, screenHeight);
        this._clock = new THREE.Clock();
        this._time = new Time();
        this._gameState = new GameState(GameStateKind.WaitingForStart);
        this._gameManager = new GameManager(this._rootScene, this._camera, this._time, this._gameState);
        this._animationFrameId = null;
        this._isDisposed = false;
        container.appendChild(this._renderer.domElement);
    }

    public resizeFramebuffer(width: number, height: number): void {   
        Game.setCameraViewFrustum(this._camera, width, height);
        this._renderer.setSize(width, height);
    }

    private static setCameraViewFrustum(camera: THREE.OrthographicCamera, width: number, height: number): void {
        const aspectRatio = width / height;
        const viewSizeScalar = Game._cameraViewSize * 0.5;
        camera.left = -viewSizeScalar * aspectRatio;
        camera.right = viewSizeScalar * aspectRatio;
        camera.top = viewSizeScalar;
        camera.bottom = -viewSizeScalar;
        camera.near = 0.1;
        camera.far = 1000;
        camera.updateProjectionMatrix();
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
        SceneProcessor.update(this._rootScene);
        this._time.deltaTime = this._clock.getDelta();
        this._renderer.render(this._rootScene, this._camera);
        this.loop();
    }

    private loop(): void {
        this._animationFrameId = requestAnimationFrame(this.loop.bind(this));
        SceneProcessor.update(this._rootScene);
        this._time.deltaTime = this._clock.getDelta();
        this._renderer.render(this._rootScene, this._camera);
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
