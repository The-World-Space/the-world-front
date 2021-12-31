import { Component } from "the-world-engine";

export class TestExectuer extends Component {
    private _testFunc: (() => void)|null = null;

    protected start(): void {
        this._testFunc?.call(this);
    }

    public setTestFunc(func: () => void): void {
        this._testFunc = func;
    }
}
