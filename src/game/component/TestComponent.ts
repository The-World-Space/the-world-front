import { Component } from "../engine/hierarchy_object/Component";
import { TestComponent2 } from "./TestComponent2";

export class TestComponent extends Component {
    public messageHead = "TestComponent";

    protected start(): void {
        console.log("a", this.messageHead);
        this.gameObject.addComponent(TestComponent2);
        console.log("b", this.messageHead);
    }

    protected awake(): void {
        console.log("TestComponent.awake()", this.messageHead);
    }

    public onDestroy(): void {
        console.log("TestComponent.onDestroy()", this.messageHead);
    }

    public onEnable(): void {
        console.log("TestComponent.onEnable()", this.messageHead);
    }

    public onDisable(): void {
        console.log("TestComponent.onDisable()", this.messageHead);
    }
}
