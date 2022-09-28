import { Vector2 } from "three/src/Three";
import { Component, GridPointer } from "the-world-engine";
import { PlayerNetworker } from "../networker/PlayerNetworker";
import { PlayerGridMovementController } from "./PlayerGridMovementController";

export class PlayerMovementRemoteController extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents = [PlayerGridMovementController];

    private _playerGridMovementController: PlayerGridMovementController|null = null;
    private _networkManager: PlayerNetworker|null = null;
    private _userId: string|null = null;
    private _gridPointer: GridPointer|null = null;
    private _listenerAdded = false;

    public awake(): void {
        this._playerGridMovementController = this.gameObject.getComponent(PlayerGridMovementController);
    }

    public setNetworkManager(networkManager: PlayerNetworker, userId: string): void {
        this._networkManager = networkManager;
        this._userId = userId;

        // TODO: fix this (remove as any)
        this._networkManager.ee.on(`force_move_${this._userId}` as any, this.onMove);
        this._networkManager.ee.on(`teleport_${this._userId} as any`, this.onTeleport);
    }

    public onDestroy(): void {
        if (this._networkManager === null) return;
        if (this._userId === null) return;
        // TODO: same here
        this._networkManager.ee.removeListener(`force_move_${this._userId}` as any, this.onMove);
        this._networkManager.ee.removeListener(`teleport_${this._userId}` as any, this.onTeleport);
    }

    private onTeleport = (gridPosition: Vector2): void => {
        this._playerGridMovementController?.teleport(gridPosition);
    };

    private onMove = (destination: Vector2): void => {
        const movementController = this._playerGridMovementController;
        if (!movementController) return;

        if (!this._listenerAdded) {
            movementController.onMovedToTarget.addListener(this.onMovedToTarget);
            this._listenerAdded = true;
            movementController.receiveKeyboardInput = false;
            this._gridPointer = movementController.gridPointer;
            movementController.gridPointer = null;
        }
        movementController.tryStartPathfind(destination);
    };

    private onMovedToTarget = (): void => {
        const movementController = this._playerGridMovementController;
        if (!movementController) return;

        if (this._listenerAdded) {
            movementController.onMovedToTarget.removeListener(this.onMovedToTarget);
            this._listenerAdded = false;
            movementController.receiveKeyboardInput = true;
            movementController.gridPointer = this._gridPointer;
            this._gridPointer = null;
        }
    };
}
