import { Vector2 } from "three";
import { GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";
import { Server } from "../connect/types";
import { CssSpriteRenderer } from "../script/render/CssSpriteRenderer";
import { GridCollider } from "../script/physics/GridCollider";
import { GridObjectCollideMap } from "../script/physics/GridObjectCollideMap";
import { IGridCoordinatable } from "../script/post_render/IGridCoordinatable";

export class NetworkImagePrefab extends Prefab {
    private _collideMap = new PrefabRef<IGridCoordinatable>();
    private _imageInfo = new PrefabRef<Server.ImageGameObject>();
    private _gridObjectCollideMap = new PrefabRef<GridObjectCollideMap>();
    private _colliders = new PrefabRef<Vector2[]>();

    public withGridInfo(collideMap: PrefabRef<IGridCoordinatable>): NetworkImagePrefab {
        this._collideMap = collideMap;
        return this;
    }

    public withImageInfo(imageInfo: PrefabRef<Server.ImageGameObject>): NetworkImagePrefab {
        this._imageInfo = imageInfo;
        return this;
    }

    public withCollideInfo(
        gridObjectCollideMap: PrefabRef<GridObjectCollideMap>,
        colliders: PrefabRef<Vector2[]>
    ): NetworkImagePrefab {
        this._gridObjectCollideMap = gridObjectCollideMap;
        this._colliders = colliders;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CssSpriteRenderer, c => {
                const image = this._imageInfo.ref;
                const ref = this._collideMap.ref;
                if (!image) throw new Error("image info is not given");
                if (!ref) return;
                c.asyncSetImagePath(image.proto_.src);
                c.imageHeight = image.proto_.height * ref.gridCellHeight;
                c.imageWidth = image.proto_.width * ref.gridCellWidth;
                c.pointerEvents = false;
                c.imageCenterOffset = new Vector2(0.5, 0.5);
            })
            .withComponent(GridCollider, c => {
                c.gridObjectCollideMap = this._gridObjectCollideMap.ref;
                if (this._colliders.ref) {
                    for (const point of this._colliders.ref) {
                        c.addCollider(point.x, point.y);
                    }
                }
            });
    }
}
