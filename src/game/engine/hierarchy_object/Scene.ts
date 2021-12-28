import * as THREE from "three";
import { GameObjectBuilder } from "./GameObject";
import { Transform } from "./Transform";

export class Scene extends THREE.Scene {
    private registerTransform(transform: Transform): void {
        this.add(transform);
        const gameObject = transform.gameObject;

        if (gameObject.activeInHierarchy) {
            transform.traverseVisible(item => {
                if (item instanceof Transform) item.gameObject.foreachComponent(c => {
                    if (c.enabled) c.onEnable();
                }); //tryEnableComponents
            });

            transform.traverseVisible(item => {
                if (item instanceof Transform) item.gameObject.foreachComponent(c => {
                    if (c.enabled) c.tryCallStart();
                }); //tryStartComponents
            });
        }
    }
    
    public addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): void {
        const gameObject = gameObjectBuilder.build();
        gameObjectBuilder.initialize();
        if (gameObject.unsafeGetTransform() instanceof Transform) {
            this.registerTransform(gameObject.unsafeGetTransform() as Transform); //it"s safe because it use same logic as GameObject.registerTransform()
        } else {
            throw new Error("unreachable");
        }
    }
}
