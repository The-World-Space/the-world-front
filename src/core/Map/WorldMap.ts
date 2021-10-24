import { Effect } from "./Objects/Effect";
import { Floor } from "./Objects/Floor";
import { Wall } from "./Objects/Wall";


export class WorldMap {
    _effects: Effect[];
    _walls: Wall[];
    _floors: Floor[];

    constructor() {
        this._effects = [];
        this._walls = [];
        this._floors = [];
    }
    

    setEffects(effects: Effect[]) {
        this._effects = effects;
    }

    getEffects() {
        return this._effects;
    }


    setFloors(floors: Floor[]) {
        this._floors = floors;
    }

    getFloors() {
        return this._effects;
    }


    setWalls(walls: Wall[]) {
        this._walls = walls;
    }

    getWalls() {
        return this._walls;
    }
}