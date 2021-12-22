export interface IReadonlyGameScreen {
    get width(): number;
    get height(): number;
    addOnResizeEventListener(delegate: (width: number, height: number) => void): void;
    removeOnResizeEventListener(delegate: (width: number, height: number) => void): void;
}
