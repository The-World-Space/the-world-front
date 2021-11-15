import { Physics } from "../../core/Physics/Physics";



export class Controler {
    private _physics: Physics;

    constructor(physics: Physics) {
        this._physics = physics;
    }
}