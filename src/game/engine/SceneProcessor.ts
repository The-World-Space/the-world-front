import { GameObject } from "./hierarchyObject/GameObject";
import { Scene } from "./hierarchyObject/Scene";

export class SceneProcessor {
    public static init(scene: Scene): void {
        scene.traverse(child => {
            if (child instanceof GameObject) {
                if (child.activeInHierarchy && child.activeSelf) {
                    child.foreachComponent(component => {
                        if (component.enabled) {
                            component.onEnable();
                        }
                    });
                }
            }
        });

        scene.traverse(child => {
            if (child instanceof GameObject) {
                if (child.activeInHierarchy && child.activeSelf) {
                    child.foreachComponent(component => {
                        if (component.enabled) {
                            component.tryCallStart();
                        }
                    });
                }
            }
        });
    }

    public static update(scene: Scene): void {
        scene.traverseVisible((object: THREE.Object3D) => {
            if (object instanceof GameObject) {
                if (object.activeSelf) {
                    object.update();
                }
            }
        });
    }
}
