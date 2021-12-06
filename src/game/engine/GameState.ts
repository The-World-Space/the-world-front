export interface IReadonlyGameState {
    get kind(): GameStateKind;
}

export class GameState implements IReadonlyGameState {
    private _gameStateKind: GameStateKind;

    public constructor(gameStateKind: GameStateKind) {
        this._gameStateKind = gameStateKind;
    }

    public get kind(): GameStateKind {
        return this._gameStateKind;
    }

    public set kind(gameStateKind: GameStateKind) {
        this._gameStateKind = gameStateKind;
    }
}

export enum GameStateKind {
    WaitingForStart,
    Initializing,
    Running,
    Finalizing,
    Finalized
}
