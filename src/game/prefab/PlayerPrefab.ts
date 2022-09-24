import {
    GameObjectBuilder,
    GridEventMap,
    GridPointer,
    IGridCollidable,
    //PlayerGridEventInvoker,
    PrefabRef} from "the-world-engine";
import { Vector2 } from "three/src/Three";

import { PlayerGridMovementController } from "../script/controller/PlayerGridMovementController";
import { BasePlayerPrefab } from "./BasePlayerPrefab";

export class PlayerPrefab extends BasePlayerPrefab {
    private readonly _collideMaps: PrefabRef<IGridCollidable>[] = [];
    private readonly _gridEventMaps: PrefabRef<GridEventMap>[] = [];
    private _gridPosition = new PrefabRef<Vector2>();
    private _gridPointer = new PrefabRef<GridPointer>();
    
    public withCollideMap(colideMap: PrefabRef<IGridCollidable>): this {
        this._collideMaps.push(colideMap);
        return this;
    }

    public withGridEventMap(gridEventMap: PrefabRef<GridEventMap>): this {
        this._gridEventMaps.push(gridEventMap);
        return this;
    }

    public withGridPosition(gridPosition: PrefabRef<Vector2>): this {
        this._gridPosition = gridPosition;
        return this;
    }

    public withPathfindPointer(gridPointer: PrefabRef<GridPointer>): this {
        this._gridPointer = gridPointer;
        return this;
    }

    public make(): GameObjectBuilder {
        return super.make()
            .withComponent(PlayerGridMovementController, c => {
                if (1 <= this._collideMaps.length) {
                    if (this._collideMaps[0].ref) {
                        c.setGridInfoFromCollideMap(this._collideMaps[0].ref);
                    }
                }

                for (let i = 0; i < this._collideMaps.length; i++) {
                    if (this._collideMaps[i].ref) {
                        c.addCollideMap(this._collideMaps[i].ref!);
                    }
                }
                
                if (this._gridPosition.ref) c.initPosition = this._gridPosition.ref;
                if (this._gridPointer) c.gridPointer = this._gridPointer.ref;
                c.speed = 10;
            })
            // .withComponent(PlayerGridEventInvoker, c => {
            //     for (let i = 0; i < this._gridEventMaps.length; i++) {
            //         if (this._gridEventMaps[i].ref) {
            //             c.addGridEventMap(this._gridEventMaps[i].ref!);
            //         }
            //     }
            // })
        ;
    }
}
