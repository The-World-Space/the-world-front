import { Component } from "../Component";

export class TestComponent extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    protected start(): void { 
        //console.log("start");
    }
    public update(): void { 
        //console.log("update");
    }
    public onDestroy(): void { }
}