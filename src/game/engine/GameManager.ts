import * as THREE from "three";
import { IReadonlyTime } from "./IReadonlyTime";
import { InputHandler } from "./InputHandler";
import { Instantiater } from "./Instantiater";
import { IReadonlyGameState } from "./GameState";
import { Scene } from "./hierarchy_object/Scene";

export class GameManager {
    private readonly _rootScene: Scene;
    private readonly _camera: THREE.OrthographicCamera;
    private readonly _time: IReadonlyTime;
    private readonly _inputHandler: InputHandler;
    private readonly _instantlater: Instantiater;
    private readonly _gameState: IReadonlyGameState;

    public constructor(rootScene: Scene, camera: THREE.OrthographicCamera, time: IReadonlyTime, gameState: IReadonlyGameState) {
        this._rootScene = rootScene;
        this._camera = camera;
        this._time = time;
        this._gameState = gameState;
        this._inputHandler = new InputHandler();
        this._instantlater = new Instantiater(this);
    }

    public dispose(): void {
        this._inputHandler.dispose();
    }

    public get rootScene(): Scene {
        return this._rootScene;
    }

    public get camera(): THREE.OrthographicCamera {
        return this._camera;
    }

    public get inputHandler(): InputHandler {
        return this._inputHandler;
    }

    public get time(): IReadonlyTime {
        return this._time;
    }

    public get gameState(): IReadonlyGameState {
        return this._gameState;
    }

    public get instantlater(): Instantiater {
        return this._instantlater;
    }
}
