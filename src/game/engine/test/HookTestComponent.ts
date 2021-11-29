import { Component } from "../hierarchyObject/Component";

export class HookTestComponent extends Component {
    public startMessage: string = "onStart";
    public onEnableMessage: string = "onEnable";
    public onDisableMessage: string = "onDisable";

    protected start(): void { 
        console.log(`${this._gameObject.name}: ${this.startMessage}`);
    }

    public onEnable(): void {
        console.log(`${this._gameObject.name}: ${this.onEnableMessage}`);
    }

    public onDisable(): void {
        console.log(`${this._gameObject.name}: ${this.onDisableMessage}`);
    }
}
