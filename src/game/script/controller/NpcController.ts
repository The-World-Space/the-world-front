import { Component, Coroutine, CoroutineIterator, WaitForSeconds } from "the-world-engine";
import { Vector2 } from "three";
import { NpcGridMovementController } from "./NpcGridMovementController";
import { PlayerStatusRenderController } from "./PlayerStatusRenderController";

type InstructionType = "move" | "moveRandom" | "print" | "wait" | "waitRandom";

export class NpcController extends Component {
    public readonly requiredComponents = [NpcGridMovementController, PlayerStatusRenderController];

    private _npcGridMovementController: NpcGridMovementController|null = null;
    private _playerStatusRenderController: PlayerStatusRenderController|null = null;

    public awake(): void {
        this._npcGridMovementController = this.gameObject.getComponent(NpcGridMovementController)!;
        this._playerStatusRenderController = this.gameObject.getComponent(PlayerStatusRenderController)!;
    }

    public moveTo(gridPosition: Vector2|[number, number]): void {
        this._npcGridMovementController!
            .tryStartPathfind(gridPosition instanceof Vector2 ? gridPosition : new Vector2(gridPosition[0], gridPosition[1]));
    }

    private readonly _tempVector2 = new Vector2();

    public moveToRandomPosition(radius = 5): void {
        const randomPosition = this._tempVector2
            .random()
            .addScalar(-0.5)
            .multiplyScalar(radius)
            .add(this._npcGridMovementController!.positionInGrid);
        
        randomPosition.x = Math.round(randomPosition.x);
        randomPosition.y = Math.round(randomPosition.y);
        
        this.moveTo(randomPosition);
    }

    public printText(text: string): void {
        this._playerStatusRenderController!.setChatBoxText(text);
    }

    private _coroutine: Coroutine|null = null;

    public startAutoPlay(instructions: [[InstructionType, ...any]]): void {
        if (this._coroutine) {
            this.stopAutoPlay();
        }
        this._coroutine = this.startCorutine(this.autoPlay(instructions));
    }

    private *autoPlay(instructions: [[InstructionType, ...any]]): CoroutineIterator {
        for (; ; ) {
            for (const instruction of instructions) {
                switch (instruction[0]) {
                case "move":
                    this.moveTo(instruction[1]);
                    break;
                case "moveRandom":
                    this.moveToRandomPosition(instruction[1]);
                    break;
                case "print":
                    this.printText(instruction[1]);
                    break;
                case "wait":
                    yield new WaitForSeconds(instruction[1]);
                    break;
                case "waitRandom":
                    yield new WaitForSeconds(Math.random() * instruction[1]);
                }
            }
            yield null;
        }
    }

    public stopAutoPlay(): void {
        this.stopCoroutine(this._coroutine!);
    }
}
