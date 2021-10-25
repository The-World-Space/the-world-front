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
}