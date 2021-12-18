import { Camera } from "./component/render/Camera";
import { TestComponent } from "./component/TestComponent";
import { Bootstrapper } from "./engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
export class EngineTestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        return this.sceneBuilder
            .withChild(instantlater.buildGameObject("Camera")
                .withComponent(Camera))
            .withChild(instantlater.buildGameObject("TestObject")
                .withComponent(TestComponent, c => c.messageHead = "TestComponent"));
    }
}
