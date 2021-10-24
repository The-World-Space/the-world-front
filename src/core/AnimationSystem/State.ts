import AnimationManager from "./AnimationManager";


interface StateArgs<T> {
    action: (manager: AnimationManager<T>) => Promise<State<T>>
}

/**
 * 상태
 */
class State<T> {
    action: (manager: AnimationManager<T>) => Promise<State<T>>

    constructor(args: StateArgs<T>) {
        this.action = args.action;
    }
}

export default State;