import { goingDx, goingDy, Size } from "../types/Base";
import { Character } from "../Character/Character";
import { WorldMap } from "../Map/WorldMap";
import { Point, Direction } from "../types/Base";

export class Physics {
    private _size!: Size;

    private _map!: WorldMap;
    private _characters!: Character<any>[];

    constructor(map: WorldMap, characters: Character<any>[], size: Size) {
        this.setMap(map);
        this.setCharacters(characters);
        this.setSize(size);
    }

    ableToGo(pos: Point, go: Direction) {
        const list_dy = [NaN, 0, 1, 0, 0];
        const list_dx = [NaN, 0, 0, -1, 1];

        const dy = list_dy[go];
        const dx = list_dx[go];
        
        const isTherePhysicsLine = this._map.getPhysicsLineMap()[pos.y + dy][2 * pos.x + dx + 1];

        return !isTherePhysicsLine;
    }

    nextPosition(pos: Point, go: Direction) {
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