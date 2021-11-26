import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { GameManager } from "./GameManager";
import { SceneProcessor } from "./SceneProcessor";
import { Time } from "./Time";

export class Game {
    private readonly _rootScene: THREE.Scene;
    private readonly _camera: THREE.OrthographicCamera;
    private readonly _renderer: CSS3DRenderer;
    private readonly _clock: THREE.Clock;
    private readonly _time: Time;
    private readonly _gameManager: GameManager;
    private _animationFrameId: number | null;

    public constructor(container: HTMLElement, screenWidth: number, screenHeight: number) {
        this._rootScene = new THREE.Scene();
        this._camera = new THREE.OrthographicCamera(
            screenWidth / - 2,
            screenWidth / 2,
            screenHeight / 2,
            screenHeight / - 2,
            1,
            1000
        );
        this._renderer = new CSS3DRenderer();
        this._renderer.setSize(screenWidth, screenHeight);
        this._clock = new THREE.Clock();
        this._time = new Time();
        this._gameManager = new GameManager(this._rootScene, this._camera, this._time);
        this._animationFrameId = null;
        container.appendChild(this._renderer.domElement);
    }

    public resizeFramebuffer(width: number, height: number): void {   
        this._camera.left = width / - 2;
        this._camera.right = width / 2;
        this._camera.top = height / 2;
        this._camera.bottom = height / - 2;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);
    }

    public run(): void {
        this._clock.start();
        this.loop();
    }

    public loop(): void {
        this._animationFrameId = requestAnimationFrame(() => this.loop());
        SceneProcessor.run(this._rootScene);
        this._time.deltaTime = this._clock.getDelta();
        this._renderer.render(this._rootScene, this._camera);
    }

    public dispose(): void {
        if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
        this._gameManager.dispose();
    }
}
