import { Component } from "../hierarchyObject/Component";

export class HookTestComponent extends Component {
    public startMessage: string = "onStart";
    public onEnableMessage: string = "onEnable";
    public onDisableMessage: string = "onDisable";

    public start(): void { 
        console.log(this.startMessage);
    }

    public onEnable(): void {
        console.log(this.onEnableMessage);
    }

    public onDisable(): void {
        console.log(this.onDisableMessage);
    }
}
