import { Component } from "../../engine/hierarchy_object/Component";
import { ComponentConstructor } from "../../engine/hierarchy_object/ComponentConstructor";
import { GridEventMap } from "../event/GridEventMap";
import { PlayerGridMovementController } from "./PlayerGridMovementController";

export class PlayerGridEventInvoker extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [PlayerGridMovementController];

    private readonly _collideSize: number = 8;
    private _playerGridMovementController: PlayerGridMovementController|null = null;
    private _gridEventMaps: GridEventMap[] = [];
    private _onMoveToTargetBind: (x: number, y: number) => void = this.onMoveToTarget.bind(this);

    protected awake(): void {
        this._playerGridMovementController = this.gameObject.getComponent(PlayerGridMovementController);
        this._playerGridMovementController!.addOnMoveToTargetEventListener(this._onMoveToTargetBind);
    }

    private onMoveToTarget(x: number, y: number): void {
        this._gridEventMaps.forEach((gridEventMap) => {
            gridEventMap.tryInvokeEvent(x, y, this._collideSize, this._collideSize, this.gameObject);
        });
    }

    public addGridEventMap(gridEventMap: GridEventMap): void {
        this._gridEventMaps.push(gridEventMap);
    }
}
