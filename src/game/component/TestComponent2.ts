import { Component } from "../engine/hierarchy_object/Component";

export class TestComponent2 extends Component {
    public messageHead = "TestComponent2";

    protected start(): void {
        console.log("TestComponent2.start()", this.messageHead);
    }

    protected awake(): void {
        console.log("TestComponent2.awake()", this.messageHead);
    }

    public onDestroy(): void {
        console.log("TestComponent2.onDestroy()", this.messageHead);
    }

    public onEnable(): void {
        console.log("TestComponent2.onEnable()", this.messageHead);
    }

    public onDisable(): void {
        console.log("TestComponent2.onDisable()", this.messageHead);
    }
}
