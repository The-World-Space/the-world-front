import { GameObjectBuilder } from "../hierarchy_object/GameObject";
import { Scene } from "../hierarchy_object/Scene";

export class SceneBuilder {
    private readonly _scene: Scene;
    private readonly _children: GameObjectBuilder[];
    
    public constructor(scene: Scene) {
        this._scene = scene;
        this._children = [];
    }

    public withChild(child: GameObjectBuilder): SceneBuilder {
        this._children.push(child);
        return this;
    }

    public build(): void {
        for (const child of this._children) {
            this._scene.add(child.build().unsafeGetTransform()); //it's safe because component initialize will be called by SceneProsessor
        }
    }

    public initialize(): void {
        for (const child of this._children) child.initialize();
    }
}
