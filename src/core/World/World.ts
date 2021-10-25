import { Character } from "../Character/Character";
import { WorldMap } from "../Map/WorldMap";
import { Physics } from "../Physics/Physics";


export class World {
    _map: WorldMap;
    _characters: Character<any>[];
    _physics: Physics;

    constructor() {
        this._map = new WorldMap();
        this._characters = [];
        this._physics = new Physics(this._map, this._characters);
    }

    
    getMap() {
        return this._map;
    }

    setMap(map: WorldMap) {
        this._map = map;
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
}