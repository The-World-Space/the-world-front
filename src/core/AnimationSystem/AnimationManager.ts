import { State } from "./State";


/**
 * 애니메이션을 총괄하는 Manager입니다.
 */
export class AnimationManager<situationType> {
    // public
    situation: situationType;
    defaultState: State<situationType>;

    // private
    private _inturpt: ((value: void | PromiseLike<void>) => void) | null = null;


    constructor(situation: situationType, defaultState: State<situationType>) {
        this.situation = situation;
        this.defaultState = defaultState;
    }


    /**
     * 맨 처음 에니메이션을 시작하기 위해 실행해야할 메소드 입니다.
     */
    async init() {
        let state = this.defaultState;

        for (; ;) {
            state = await state.action(this);
        }
    }


    /**
     * situation을 결정하는 메서드 입니다.
     * 
     * @param situation 변경할 situation 입니다.
     * @param escape escape 여부를 결정합니다.
     */
    setsituation(situation: situationType, escape: boolean) {
        this.situation = situation;

        escape && this.escape();
    }


    /**
     * 현재의 sleep, stop등을 탈출하고 다음 작업으로 이어갈 수 있는 escape 입니다.
     */
    escape() {
        this._inturpt && this._inturpt();
    }


    /**
     * escape를 하지 않으면 영원히 Pending 되는 promise factory 입니다.
     * 
     * @returns escape에 의해 중단 될 수 있는 promise.
     */
    stop() {
        return new Promise<void>((res, _) => {
            this._inturpt = res;
        })
    }


    /**
     * escape를 하지 않으면 time(ms)동안 Pending 되는 promise factory 입니다.
     * 
     * @param time 몇 ms 동안 대기할지
     * @returns escape에 의해 중단 될 수 있는 promise.
     */
    sleep(time: number) {
        return new Promise<void>((res, _) => {
            this._inturpt = res;

            setTimeout(() => {
                res();
            }, time)
        })
    }
}
