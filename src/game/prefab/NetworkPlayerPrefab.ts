import {
    GameObjectBuilder,
    IGridCollidable,
    PrefabRef} from "the-world-engine";
import { Vector2 } from "three/src/Three";

import { NetworkGridMovementController } from "../script/controller/NetworkGridMovementController";
import { PlayerNetworker } from "../script/networker/PlayerNetworker";
import { BasePlayerPrefab } from "./BasePlayerPrefab";

export class NetworkPlayerPrefab extends BasePlayerPrefab {
    private _tilemap: PrefabRef<IGridCollidable> = new PrefabRef();
    private _gridPosition: PrefabRef<Vector2> = new PrefabRef();

    private _networkManager: PlayerNetworker | null = null;
    private _userId: string | null = null;

    public withGridInfo(tilemap: PrefabRef<IGridCollidable>): this {
        this._tilemap = tilemap;
        return this;
    }

    public withGridPosition(gridPosition: PrefabRef<Vector2>): this {
        this._gridPosition = gridPosition;
        return this;
    }

    public withNetworkManager(networkManager: PlayerNetworker, userId: string): this {
        this._networkManager = networkManager;
        this._userId = userId;
        return this;
    }

    public make(): GameObjectBuilder {
        return super.make()
            .withComponent(NetworkGridMovementController, c => {
                if (this._tilemap.ref) {
                    c.gridCellHeight = this._tilemap.ref.gridCellHeight;
                    c.gridCellWidth = this._tilemap.ref.gridCellWidth;
                    c.gridCenter = this._tilemap.ref.gridCenter;
                }
                if (this._gridPosition.ref) c.initPosition = this._gridPosition.ref;
                if (this._networkManager && this._userId)
                    c.setNetworkManager(this._userId, this._networkManager);
                c.speed = 10;
            })
        ;
    }
}
