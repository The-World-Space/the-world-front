import { 
    Component,
    GameObject,
    GridObjectCollideMap,
    IGridCoordinatable,
    PrefabRef,
    ZaxisSorter
} from "the-world-engine";
import { Vector2, Vector3 } from "three/src/Three";

import { Server } from "../../connect/types";
import { NetworkImagePrefab } from "../../prefab/NetworkImagePrefab";
import { ImageNetworker } from "../networker/ImageNetworker";

const PREFIX = "@@tw/game/component/gamemanager/NetworkImageManager";
const flatTypes = new Set([Server.GameObjectType.Floor, Server.GameObjectType.Effect]);

export class NetworkImageManager extends Component {
    private _networkImageMap: Map<number, GameObject> = new Map();

    private _iGridCoordinateable: IGridCoordinatable | null = null;
    private _gridObjectCollideMap: GridObjectCollideMap | null = null;
    private _initImageList: Server.ImageGameObject[] = [];
    private _imageNetworker: ImageNetworker | null = null;

    public set iGridCollidable(val: IGridCoordinatable | null) {
        this._iGridCoordinateable = val;
    }

    public set gridObjectCollideMap(val: GridObjectCollideMap | null) {
        this._gridObjectCollideMap = val;
    }

    public set initImageList(val: Server.ImageGameObject[]) {
        this._initImageList = [...val];
    }

    public initNetwork(imageNetworker: ImageNetworker): void {
        this._imageNetworker = imageNetworker;
        this._imageNetworker.ee.on("create", image => {
            this.addOneImage(image);
        });
        this._imageNetworker.ee.on("delete", imageId => {
            this.removeOneImage(imageId);
        });
    }

    public start(): void {
        this._initImageList.forEach(info => this.addOneImage(info));
        this._initImageList = [];
    }

    public addOneImage(info: Server.ImageGameObject): void {
        this._buildNetworkImage(info);
    }

    public removeOneImage(imageId: number): void {
        const image = this._networkImageMap.get(imageId);
        if (!image) return;
        image.destroy();
        this._networkImageMap.delete(imageId);
    }

    private _buildNetworkImage(imageInfo: Server.ImageGameObject): void {
        const instantlater = this.engine.instantiater;
        const prefabRef = new PrefabRef<GameObject>();
        const gcx = this._iGridCoordinateable?.gridCenterX || 0.5;
        const gcy = this._iGridCoordinateable?.gridCenterY || 0.5;
        const gw = this._iGridCoordinateable?.gridCellWidth || 1;
        const gh = this._iGridCoordinateable?.gridCellHeight || 1;
        
        if (!imageInfo.proto_) return;
        
        const zindex = 
            (imageInfo.proto_.type === Server.GameObjectType.Effect) ? 380 :
            (imageInfo.proto_.type === Server.GameObjectType.Floor)  ? -380 :
            0;

        const calculated =  new Vector3(
            gcx + imageInfo.x * gw - gw / 2,
            gcy + imageInfo.y * gh - gh / 2,
            zindex
        );
        
        const colliders = imageInfo.proto_.colliders.map(c => new Vector2(c.x, c.y));
        
        const prefab = 
            instantlater.buildPrefab(`${PREFIX}/image_${imageInfo.id}`, NetworkImagePrefab, calculated)
                .withGridInfo(new PrefabRef(this._iGridCoordinateable))
                .withImageInfo(new PrefabRef(imageInfo))
                .withCollideInfo(new PrefabRef(this._gridObjectCollideMap), new PrefabRef(colliders));
        
        const builder = prefab.make();
        builder.getGameObject(prefabRef);
        this._networkImageMap.set(imageInfo.id, prefabRef.ref!);
        this.gameObject.addChildFromBuilder(builder);

        // Put soter after build
        if (!flatTypes.has(imageInfo.proto_.type)) {
            const c = prefabRef.ref!.addComponent(ZaxisSorter);
            if (!c) throw new Error("fail to add");

            c.runOnce = true;
        }
    }
}
