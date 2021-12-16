import { Scene } from "./hierarchy_object/Scene";
import { Transform } from "./hierarchy_object/Transform";

export class SceneProcessor {
    public static init(scene: Scene): void {
        scene.traverse(child => {
            if (child instanceof Transform) {
                const gameObject = child.attachedGameObject;
                if (gameObject.activeInHierarchy && gameObject.activeSelf) {
                    gameObject.foreachComponent(component => {
                        if (component.enabled) {
                            component.onEnable();
                        }
                    });
                }
            }
        });

        scene.traverse(child => {
            if (child instanceof Transform) {
                const gameObject = child.attachedGameObject;
                if (gameObject.activeInHierarchy && gameObject.activeSelf) {
                    gameObject.foreachComponent(component => {
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
            if (object instanceof Transform) {
                const gameObject = object.attachedGameObject;
                if (gameObject.activeSelf) {
                    gameObject.update(); //TODO: update only active by use caching
                }
            }
        });
    }
}
