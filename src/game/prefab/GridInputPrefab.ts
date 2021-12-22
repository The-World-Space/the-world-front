import { GridPointer } from "../script/input/GridPointer";
import { PointerGridInputListener } from "../script/input/PointerGridInputListener";
import { IGridCollidable } from "../script/physics/IGridCollidable";
import { CameraRelativeZaxisSorter } from "../script/render/CameraRelativeZaxisSorter";
import { GameObjectBuilder, } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";

export class GridInputPrefab extends Prefab {
    private _gridCollideMap: PrefabRef<IGridCollidable> = new PrefabRef();
    private _gridPointer: PrefabRef<GridPointer> = new PrefabRef();

    public withCollideMap(collideTilemap: PrefabRef<IGridCollidable>): GridInputPrefab {
        this._gridCollideMap = collideTilemap;
        return this;
    }

    public getGridPointer(gridPointer: PrefabRef<GridPointer>): GridInputPrefab {
        this._gridPointer = gridPointer;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CameraRelativeZaxisSorter, c => c.offset = -550)
            .withComponent(PointerGridInputListener, c => {
                c.inputWidth = 512;
                c.inputHeight = 512;
                c.setGridInfoFromCollideMap(this._gridCollideMap.ref!);
            })
            .withComponent(GridPointer, c => c.pointerZoffset = 600)
            .getComponent(GridPointer, this._gridPointer);
    }
}
