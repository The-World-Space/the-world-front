import { Component } from "../Component";

export class SpriteAnimator extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    protected start(): void {
        //console.log("start");
    }
    
    public update(): void {
        //console.log("update");
    }
}