import AnimationManager from "../AnimationSystem/AnimationManager";
import { GameObject } from "../types/GameObject";
import { Shape } from "../types/Shape/Shape";

export class Character<T> extends GameObject {
    animeManager: AnimationManager<T>;

    constructor(animeManager: AnimationManager<T>, shape: Shape) {
        super(shape);
        this.animeManager = animeManager;
    }
}