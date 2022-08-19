import { Component } from "the-world-engine";
import { Vector2 } from "three";
import { NpcGridMovementController } from "./NpcGridMovementController";
import { PlayerStatusRenderController } from "./PlayerStatusRenderController";

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

    public printText(text: string): void {
        this._playerStatusRenderController!.setChatBoxText(text);
    }
}
