import * as THREE from "three";
import { GameObjectBuilder } from "./GameObject";

export class Scene extends THREE.Scene {
    public addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): void {
        const gameObject = gameObjectBuilder.build();
        gameObjectBuilder.initialize();
        this.add(gameObject);
    }
}
