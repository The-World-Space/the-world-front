import { ImageGameObject } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { PrefabRef } from "../../engine/hierarchy_object/PrefabRef";
import { NetworkImagePrefab } from "../../prefab/NetworkImagePrefab";
import { IGridCollidable } from "../physics/IGridCollidable";

const PREFIX = `@@tw/game/component/gamemanager/NetworkImageManager`

export class NetworkImageManager extends Component {
    private _networkImageMap: Map<number, GameObject> = new Map();

    private _iGridCollidable: IGridCollidable | null = null;
    private _imageList: ImageGameObject[] = [];

    public set iGridCollidable(val: IGridCollidable | null) {
        this._iGridCollidable = val;
    }

    public set imageList(val: ImageGameObject[]) {
        this._imageList = [...val];
    }

    public start() {
        this._imageList.forEach(info => this.addOneImage(info));
    }

    public addOneImage(info: ImageGameObject) {
        
        this._imageList.push(info);
        this._buildNetworkImage(info);
    }

    private _buildNetworkImage(imageInfo: ImageGameObject) {
        const instantlater = this.engine.instantlater;
        const prefabRef = new PrefabRef<GameObject>();
        
        const prefab = 
            instantlater.buildPrefab(`${PREFIX}/image_${imageInfo.id}`, NetworkImagePrefab)
                .withGridInfo(new PrefabRef(this._iGridCollidable))
                .withImageInfo(new PrefabRef(imageInfo))
        
        const builder = prefab.make();
        builder.getGameObject(prefabRef);
        this._networkImageMap.set(imageInfo.id, prefabRef.ref!);
        this.gameObject.addChildFromBuilder(builder);
    }
}
