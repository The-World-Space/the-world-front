import * as THREE from "three";
import { InputHandler } from "./InputHandler";

export class GameManager {
    private readonly _rootScene: THREE.Scene;
    private readonly _camera: THREE.OrthographicCamera;
    private readonly _inputHandler: InputHandler;

    public constructor(rootScene: THREE.Scene, camera: THREE.OrthographicCamera) {
        this._rootScene = rootScene;
        this._camera = camera;
        this._inputHandler = new InputHandler();
    }

    public dispose(): void {
        this._inputHandler.dispose();
    }

    public get rootScene(): THREE.Scene {
        return this._rootScene;
    }

    public get camera(): THREE.OrthographicCamera {
        return this._camera;
    }

    public get inputHandler(): InputHandler {
        return this._inputHandler;
    }
}