import { GameObject } from "./hierarchyObject/GameObject";

export class SceneProcessor {
    public static init(scene: THREE.Scene): void {
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

    public static update(scene: THREE.Scene): void {
        scene.traverseVisible((object: THREE.Object3D) => {
            if (object instanceof GameObject) {
                if (object.activeSelf) {
                    object.update();
                }
            }
        });
    }
}
