import { CoroutineIterator } from "../engine/coroutine/CoroutineIterator";
import { WaitForSeconds } from "../engine/coroutine/YieldInstruction";
import { Component } from "../engine/hierarchy_object/Component";

export class CoroutineTest extends Component {
    protected start(): void {
        this.startCorutine(this.testCoroutine());
    }

    private *testCoroutine(): CoroutineIterator {
        for (let i = 0; i < 10; i++) {
            yield new WaitForSeconds(1);
            console.log(i);
        }
    }
}
