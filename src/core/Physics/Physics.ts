import { goingDx, goingDy, Size } from "../types/Base";
import { Character } from "../Character/Character";
import { WorldMap } from "../Map/WorldMap";
import { Point, Going } from "../types/Base";


export class Physics {
    private _size!: Size;

    private _map!: WorldMap;
    private _characters!: Character<any>[];

    constructor(map: WorldMap, characters: Character<any>[], size: Size) {
        this.setMap(map);
        this.setCharacters(characters);
        this.setSize(size);
    }

    ableToGo(pos: Point, go: Going) {
        const y = (go === Going.up)   ? 0
                : (go === Going.down) ? 1
                : 0;
        const x = (go === Going.right) ? 1
                : (go === Going.left)  ? -1
                : 0;
        const isTherePhysicsLine = this._map.getPhysicsLineMap()[pos.y + y][2 * pos.x + x + 1];

        return !isTherePhysicsLine;
    }

    nextPosition(pos: Point, go: Going) {
        const ableToGo = this.ableToGo(pos, go);
        
        const newPos = ableToGo ? {
            x: pos.x + goingDx[go],
            y: pos.y + goingDy[go],
        } : pos;

        return newPos;
    }


    getMap() {
        return this._map;
    }

    setMap(map: WorldMap) {
        this._map = map;
    }

    
    getSize() {
        return this._size;
    }

    setSize(size: Size) {
        this._size = size;
    }
    

    getCharacters() {
        return this._characters;
    }

    setCharacters(characters: Character<any>[]) {
        this._characters = characters;
    }
}