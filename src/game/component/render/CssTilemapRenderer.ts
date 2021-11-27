import { Component } from "../../engine/hierarchyObject/Component";

export class CssTilemapRenderer extends Component{
    protected readonly _disallowMultipleComponent: boolean = true;

    protected start(): void { 
        //console.log("start");
    }
    public update(): void {
    }
    public onDestroy(): void { }
}