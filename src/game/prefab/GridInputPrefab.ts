import {
    GridPointer,
    PointerGridInputListener,
    IGridCollidable,
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    ZaxisInitializer
} from "the-world-engine";

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
