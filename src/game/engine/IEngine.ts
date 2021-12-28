import { IReadonlyTime } from "./time/IReadonlyTime";
import { InputHandler } from "./input/InputHandler";
import { Instantiater } from "./Instantiater";
import { IReadonlyGameState } from "./GameState";
import { Scene } from "./hierarchy_object/Scene";
import { CameraContainer } from "./render/CameraContainer";
import { IReadonlyGameScreen } from "./render/IReadonlyGameScreen";

export interface IEngine {
    get rootScene(): Scene;

    get cameraContainer(): CameraContainer;

    get screen(): IReadonlyGameScreen;

    get input(): InputHandler;

    get time(): IReadonlyTime;

    get gameState(): IReadonlyGameState;

    get instantlater(): Instantiater;
}
