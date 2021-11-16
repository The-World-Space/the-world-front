import { Character } from "../Character/Character";
import { WorldMap } from "../Map/WorldMap";
import { Physics } from "../Physics/Physics";
import { Size } from "../types/Base";


export class World {
    private _size!: Size;
    private _map!: WorldMap;
    private _characters!: Character<any>[];
    private _physics!: Physics;

    constructor(size: Size) {
        this.setPhysics(new Physics(this.getMap(), this.getCharacters(), this._size));
        this.setMap(new WorldMap(size));
        this.setCharacters([]);
        this.setSize(size);
    }

    
    getMap() {
        return this._map;
    }

    setMap(map: WorldMap) {
        this._map = map;
        this._physics.setMap(map);
    }


    getCharacters() {
        return this._characters;
    }

    setCharacters(characters: Character<any>[]) {
        this._characters = characters;
    }


    getPhysics() {
        return this._physics;
    }

    setPhysics(physics: Physics) {
        this._physics = physics;
    }


    getSize() {
        return this._size;
    }

    setSize(size: Size) {
        this._size = size;

        this.getMap().setSize(size);
        this.getPhysics().setSize(size);
    }

}