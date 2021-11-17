import { AnimationManager } from "../../core/AnimationSystem/AnimationManager";
import { State } from "../../core/AnimationSystem/State";
import { Character } from "../../core/Character/Character";
import { Direction } from "../../core/types/Base";
import { ImageShape } from "../../core/types/Shape/ImageShape";

export interface WalkingAnimeArgs {
    walking: [string, string, string, string]
    standing: [string, string, string, string]
}

enum WalkingAnime {
    stop,
    walk,
}

export interface WalkingSituation {
    walking: WalkingAnime;
    direction: Direction;
}

export function walkingAnimeFactory(args: WalkingAnimeArgs, character: Character<any>) {
    const WALKING_DELAY = 400;
    
    const standing: State<WalkingSituation> = new State({
        async action(manager) {
            character.setShape(
                new ImageShape(character.getShape().getSize(), 
                                args.standing[manager.situation.direction - 1]));
    
            switch (manager.situation.walking) {
                case WalkingAnime.walk:
                    return walking;
                case WalkingAnime.stop:
                    await manager.stop();
                    return walking;
            }
        }
    });
    
    const walking: State<WalkingSituation> = new State({
        async action(manager) {
            character.setShape(
                new ImageShape(character.getShape().getSize(), 
                                args.walking[manager.situation.direction - 1]));
    
            switch (manager.situation.walking) {
                case WalkingAnime.walk:
                    await manager.stop();
                    return standing;
    
                case WalkingAnime.stop:
                    return standing;
            }
        }
    });
    

    const defaultSituration: WalkingSituation = {
        walking: WalkingAnime.stop,
        direction: Direction.down,
    }
    const walkAniManger = new AnimationManager(defaultSituration, standing);
    walkAniManger.init();

    return walkAniManger;
}