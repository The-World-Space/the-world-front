export class SceneBuilder {
    private readonly _scene: THREE.Scene;
    
    public constructor(scene: THREE.Scene) {
        this._scene = scene;
    }

    public withGameobject(): GameObjectBuilder {
        return new GameObjectBuilder(this._scene);
    }
}