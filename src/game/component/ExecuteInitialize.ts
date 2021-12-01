import { Component } from "../engine/hierarchyObject/Component";

export class ExecuteInitialize extends Component {
    protected start(): void {
        this.gameObject.removeComponent(this);
    }
}
