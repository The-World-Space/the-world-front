import { AnimationManager } from "../../core/AnimationSystem/AnimationManager";
import { Character } from "../../core/Character/Character";
import { Direction } from "../../core/types/Base";
import { ImageShape } from "../../core/types/Shape/ImageShape";
import { Shape } from "../../core/types/Shape/Shape";
import { walkingAnimeFactory, WalkingAnimeArgs, WalkingSituation } from "../anime/walkingAnimeFactory";

type T = WalkingSituation
type HumanArgs = {} & WalkingAnimeArgs

export class Human extends Character<T> {

    private _animeArgs: HumanArgs;
    private _last: Direction;

    constructor(shape: Shape, walkingAnimeArgs: HumanArgs) {
        super({} as AnimationManager<T>, shape);    // TODO: 꼭 고치기
        this._animeArgs = walkingAnimeArgs;
        this.animeManager = walkingAnimeFactory(walkingAnimeArgs, this);
        this._last = Direction.down;
    }

    walk(direction: Direction) {
        // this.animeManager.setSituation({
        //     walking: 1,
        //     direction,
        // }, true);
        console.log('standing')
        this._last = direction;
        this.setShape(new ImageShape(this.getShape().getSize(), this._animeArgs.walking[direction - 1]));
    }

    stop() {
        // this.animeManager.setSituation({
        //     walking: 0,
        //     direction: this.animeManager.situation.direction,
        // }, true);
        console.log('stop')
        this.setShape(new ImageShape(this.getShape().getSize(), this._animeArgs.standing[this._last - 1]));
    }
}