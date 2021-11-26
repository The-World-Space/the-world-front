import * as THREE from "three";
import { IReadonlyTime } from "./component/IReadonlyTime";
import { InputHandler } from "./InputHandler";
import { Instantiater } from "./Instantiater";
import { Time } from "./Time";

export class GameManager {
    private readonly _rootScene: THREE.Scene;
    private readonly _camera: THREE.OrthographicCamera;
    private readonly _time: Time;
    private readonly _inputHandler: InputHandler;
    private readonly _instantlater: Instantiater;

    public constructor(rootScene: THREE.Scene, camera: THREE.OrthographicCamera, time: Time) {
        this._rootScene = rootScene;
        this._camera = camera;
        this._time = time;
        this._inputHandler = new InputHandler();
        this._instantlater = new Instantiater(this);
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

    public get time(): IReadonlyTime {
        return this._time;
    }

    public get instantlater(): Instantiater {
        return this._instantlater;
    }
}