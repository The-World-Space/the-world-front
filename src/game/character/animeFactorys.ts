import { AnimationManager } from "../../core/AnimationSystem/AnimationManager";
import { State } from "../../core/AnimationSystem/State";

interface WalkingAnimeArgs {
    Left_walking: string;
    Right_walking: string;
    Up_walking: string;
    Down_walking: string;

    Left_standing: string;
    Right_standing: string;
    Up_standing: string;
    Down_standing: string;
}


enum WalkingAnime {
    stop,
    walk,
}

const WALKING_DELAY = 400;

const standing: State<WalkingAnime> = new State({
    async action(manager) {
        console.log('stading')

        switch (manager.situration) {
            case WalkingAnime.walk:
                return walking1;
            case WalkingAnime.stop:
                await manager.stop();
                return standing;
        }
    }
})

const walking1: State<WalkingAnime> = new State({
    async action(manager) {
        console.log('waling 1')

        switch (manager.situration) {
            case WalkingAnime.walk:
                await manager.sleep(WALKING_DELAY);
                return walking2;

            case WalkingAnime.stop:
                return standing;
        }
    }
})

const walking2: State<WalkingAnime> = new State({
    async action(manager) {
        console.log('walking 2')

        switch (manager.situration) {
            case WalkingAnime.walk:
                await manager.sleep(WALKING_DELAY);
                return walking1;

            case WalkingAnime.stop:
                return standing;
        }
    }
})

const walkAniManger = new AnimationManager(WalkingAnime.stop, standing);
walkAniManger.init();


export function walkingAnimeFactory(args: WalkingAnimeArgs) {
    
    
}