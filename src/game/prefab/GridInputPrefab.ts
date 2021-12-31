import { GridPointer } from "../engine/script/input/GridPointer";
import { PointerGridInputListener } from "../engine/script/input/PointerGridInputListener";
import { IGridCollidable } from "../engine/script/physics/IGridCollidable";
import { GameObjectBuilder, } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";
import { ZaxisInitializer } from "../engine/script/render/ZaxisInitializer";

export class GridInputPrefab extends Prefab {
    private _gridCollideMap = new PrefabRef<IGridCollidable>();
    private _gridPointer = new PrefabRef<GridPointer>();

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
        //.withComponent(CameraRelativeZaxisSorter, c => c.offset = -550)
            .withComponent(ZaxisInitializer)
            .withComponent(PointerGridInputListener, c => {
                c.inputWidth = 512;
                c.inputHeight = 512;
                c.setGridInfoFromCollideMap(this._gridCollideMap.ref!);
            })
            .withComponent(GridPointer, c => c.pointerZoffset = 1000000)
            .getComponent(GridPointer, this._gridPointer);
    }
}
