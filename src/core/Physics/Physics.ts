import { Character } from "../Character/Character";
import { WorldMap } from "../Map/WorldMap";
import { Point, Going } from "../types/Base";


export class Physics<T> {
    map: WorldMap;
    characters: Character<T>[];

    constructor(map: WorldMap, characters: Character<T>[]) {
        this.map = map;
        this.characters = characters;
    }

    ableToGo(pos: Point, go: Going) {
        const y = (go === Going.up)   ? 0
                : (go === Going.down) ? 1
                : 0;
        const x = (go === Going.right) ? 1
                : (go === Going.left)  ? -1
                : 0;
        const isTherePhysicsLine = this.map.getPhysicsLineMap()[pos.y + y][2 * pos.x + x + 1];

        return !isTherePhysicsLine;
    }
}