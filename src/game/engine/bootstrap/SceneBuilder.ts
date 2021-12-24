import { Component } from "../hierarchy_object/Component";
import { GameObject, GameObjectBuilder } from "../hierarchy_object/GameObject";
import { Scene } from "../hierarchy_object/Scene";
import { Transform } from "../hierarchy_object/Transform";
import { isUpdateableComponent, SceneProcessor, UpdateableComponent } from "../SceneProcessor";

export class SceneBuilder {
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _scene: Scene;
    private readonly _children: GameObjectBuilder[];
    
    public constructor(sceneProcessor: SceneProcessor, scene: Scene) {
        this._sceneProcessor = sceneProcessor;
        this._scene = scene;
        this._children = [];
    }

    public withChild(child: GameObjectBuilder): SceneBuilder {
        this._children.push(child);
        return this;
    }

    public build(): Component[] {
        for (const child of this._children) {
            this._scene.add(child.build().unsafeGetTransform()); //it's safe because component initialize will be called by SceneProsessor
        }

        for (const child of this._children) child.initialize();

        const activeComponentsInScene = this.getAllComponentsInScene().filter(c => {
            return c.gameObject.activeInHierarchy && c.enabled;
        });
        const updateableComponentsInScene = activeComponentsInScene.filter<UpdateableComponent>(isUpdateableComponent);
        this._sceneProcessor.addStartComponent(...activeComponentsInScene);
        this._sceneProcessor.addUpdateComponent(...updateableComponentsInScene);

        return activeComponentsInScene;
    }

    private getAllComponentsInScene(): Component[] {
        const components: Component[] = [];
        for (const child of this._scene.children as Transform[]) {
            this.getAllComponentsInGameObject(child.gameObject, components);
        }
        return components;
    }

    private getAllComponentsInGameObject(gameObject: GameObject, outArray: Component[]) {
        outArray.push(...gameObject.getComponents());
        for (const child of gameObject.transform.childrenTransform) {
            this.getAllComponentsInGameObject(child.gameObject, outArray);
        }
    }
}
