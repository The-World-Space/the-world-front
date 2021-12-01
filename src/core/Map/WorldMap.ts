import { Point, Size } from "../types/Base";
import { Effect } from "./Objects/Effect";
import { Floor } from "./Objects/Floor";
import { Wall } from "./Objects/Wall";


export class WorldMap {
    private _size!: Size;

    private _effects!: Effect[];
    private _walls!: Wall[];
    private _floors!: Floor[];
    private _physicsLineMap!: boolean[][];

    constructor(size: Size) {
        this.setSize(size);
        this.setEffects([]);
        this.setWalls([]);
        this.setFloors([]);
        this.setPhysicsLineMap([]);

        this.fillPhysicsWithBool();
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
        return this._floors;
    }


    setWalls(walls: Wall[]) {
        this._walls = walls;
    }

    getWalls() {
        return this._walls;
    }

    setSize(size: Size) {
        this._size = size;
    }

    getSize() {
        return this._size;
    }


    fillPhysicsWithBool() {
        this._physicsLineMap = 
            new Array(this._size.height).fill(0)
                .map(() => new Array(this._size.width).fill(false));
    }


    getPhysicsLineMap() {
        return this._physicsLineMap;
    }

    setPhysicsLineMap(map: boolean[][]) {
        this._physicsLineMap = map;
    }


    private _combinePhysicsLineMap(otherMap: boolean[][], start: Point) {
        const myMapYSize = this._physicsLineMap.length;
        const myMapXSize = this._physicsLineMap[0].length;
        const ySize = otherMap.length;
        const xSize = otherMap[0].length;

        const yTarget = Math.min(start.y + ySize, myMapYSize);
        const xTarget = Math.min(2 * start.x + xSize, myMapXSize);

        for (let y = start.y; y < yTarget; y++) {
            for (let x = 2 * start.x; x < xTarget; x++) {
                this._physicsLineMap[y][x] = this._physicsLineMap[y][x] || otherMap[y][x];
            }
        }
    }


    private _concatEffects(walls: Effect[]) {
        this._effects.push(...walls);
    }

    private _concatWalls(walls: Wall[]) {
        this._walls.push(...walls);
    }

    private _concatFloors(walls: Floor[]) {
        this._floors.push(...walls);
    }

    connetOtherWorld(other: WorldMap, start: Point) {
        this._concatEffects(other.getEffects());
        this._concatWalls(other.getWalls());
        this._concatFloors(other.getFloors());
        this._combinePhysicsLineMap(other.getPhysicsLineMap(), start);
    }
}