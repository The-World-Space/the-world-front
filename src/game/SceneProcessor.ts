import { GameObject } from "./GameObject";

export class SceneProcessor {
    public static run(scene: THREE.Scene): void {
        scene.traverse((object: THREE.Object3D) => {
            if (object instanceof GameObject) {
                object.update();
            }
        });
    }
}