import { Vector2 } from "three";
import { ZaxisSorter } from "../component/render/ZaxisSorter";
import { GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";
import { IGridCollidable } from "../component/physics/IGridCollidable";
import { GameObjectType, ImageGameObject } from "../connect/types";
import { CameraRelativeZaxisSorter } from "../component/render/CameraRelativeZaxisSorter";
import { CssSpriteRenderer } from "../component/render/CssSpriteRenderer";

const flatTypes = new Set([GameObjectType.Floor, GameObjectType.Effect]);

export class NetworkImagePrefab extends Prefab {
    private _tilemap: PrefabRef<IGridCollidable> = new PrefabRef();

    private _imageInfo: PrefabRef<ImageGameObject> = new PrefabRef();

    public withGridInfo(tilemap: PrefabRef<IGridCollidable>): NetworkImagePrefab {
        this._tilemap = tilemap;
        return this;
    }

    public withImageInfo(imageInfo: PrefabRef<ImageGameObject>): NetworkImagePrefab {
        this._imageInfo = imageInfo;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CssSpriteRenderer, c => {
                const image = this._imageInfo.ref;
                const ref = this._tilemap.ref;
                if (!image) throw new Error("image info is not given");
                if (!ref) return;
                c.imagePath = image.src;
                // @TODO: image height / width
                c.imageHeight = image.height * ref.gridCellHeight;
                c.imageWidth = image.width * ref.gridCellWidth;
                c.imageCenterOffset = new Vector2(0.5, 0.5);
                c.gameObject.transform.position.set(
                    ref.gridCenterX + image.x * ref.gridCellWidth - ref.gridCellWidth / 2, 
                    ref.gridCenterY + image.y * ref.gridCellHeight - ref.gridCellHeight / 2, 1);
            })
            .withComponent(ZaxisSorter, c => {
                const image = this._imageInfo.ref;
                if (!image) throw new Error("image info is not given");

                if (flatTypes.has(image.type))
                    c.gameObject.removeComponent(c);
                
                c.runOnce = true;
            })
            .withComponent(CameraRelativeZaxisSorter, c => {
                const image = this._imageInfo.ref;
                if (!image) throw new Error("image info is not given");

                if (!flatTypes.has(image.type))
                    c.gameObject.removeComponent(c);
                
                c.offset = 
                    (image.type === GameObjectType.Effect) ? 100 :
                    (image.type === GameObjectType.Floor)  ? -100 :
                    0;
            });
    }
}
