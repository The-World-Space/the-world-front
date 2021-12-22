import { ApolloClient } from "@apollo/client";
import { Vector3 } from "three";
import { Server } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { PrefabRef } from "../../engine/hierarchy_object/PrefabRef";
import { PenpalNetworkWrapper } from "../../penpal/PenpalNetworkWrapper";
import { NetworkIframePrefab } from "../../prefab/NetworkIframePrefab";
import { IGridCollidable } from "../physics/IGridCollidable";
import { CameraRelativeZaxisSorter } from "../render/CameraRelativeZaxisSorter";
import { ZaxisSorter } from "../render/ZaxisSorter";

const PREFIX = `@@tw/game/component/gamemanager/NetworkIframeManager`;
const flatTypes = new Set([Server.GameObjectType.Floor, Server.GameObjectType.Effect]);

export class NetworkIframeManager extends Component {
    private _networkIframerMap: Map<number, GameObject> = new Map();

    private _apolloClient: ApolloClient<any> | null = null;
    private _iGridCollidable: IGridCollidable | null = null;
    private _worldId: string | null = null;
    private _iframeList: Server.IframeGameObject[] = [];
    private _penpalNetworkWrapper: PenpalNetworkWrapper | null = null;

    public set apolloClient(apolloClient: ApolloClient<any>) {
        this._apolloClient = apolloClient;
    }

    public set iGridCollidable(val: IGridCollidable | null) {
        this._iGridCollidable = val;
    }

    public set worldId(id: string) {
        this._worldId = id;
    }

    public set iframeList(val: Server.IframeGameObject[]) {
        this._iframeList = [...val];
    }

    public set penpalNetworkWrapper(val: PenpalNetworkWrapper) {
        this._penpalNetworkWrapper = val;
    }

    public start() {
        this._iframeList.forEach(info => this.addOneIframe(info));
    }

    public addOneIframe(info: Server.IframeGameObject) {
        if (!this._apolloClient) throw new Error("no apollo client");
        if (!this._worldId) throw new Error("no world id");
        
        this._iframeList.push(info);
        this._buildNetworkIframe(info, this._worldId, this._apolloClient);
    }

    private _buildNetworkIframe(iframeInfo: Server.IframeGameObject, worldId: string, apolloClient: ApolloClient<any>) {
        const instantlater = this.engine.instantlater;
        const prefabRef = new PrefabRef<GameObject>();
        const gcx = this._iGridCollidable?.gridCenterX || 8;
        const gcy = this._iGridCollidable?.gridCenterY || 8;
        const gw = this._iGridCollidable?.gridCellWidth || 16;
        const gh = this._iGridCollidable?.gridCellHeight || 16;
        const calculated =  new Vector3(
            gcx + iframeInfo.x * gw - gw / 2,
            gcy + iframeInfo.y * gh - gh / 2, 1);
        
        const prefab = 
            instantlater.buildPrefab(`${PREFIX}/iframe_${iframeInfo.id}`, NetworkIframePrefab, calculated)
                .withGridInfo(new PrefabRef(this._iGridCollidable))
                .withIframeInfo(new PrefabRef(iframeInfo))
                .withApolloClient(new PrefabRef(apolloClient))
                .withPenpalNetworkWrapper(new PrefabRef(this._penpalNetworkWrapper))
                .withWorldId(new PrefabRef(worldId))
        
        const builder = prefab.make();
        builder.getGameObject(prefabRef);
        this._networkIframerMap.set(iframeInfo.id, prefabRef.ref!);
        this.gameObject.addChildFromBuilder(builder);

        // Put soter after build
        if (flatTypes.has(iframeInfo.type)) {
            const c = prefabRef.ref!.addComponent(CameraRelativeZaxisSorter);
            if (!c) throw new Error("fail to add");
            c.offset =
                (iframeInfo.type === Server.GameObjectType.Effect) ? 100 :
                (iframeInfo.type === Server.GameObjectType.Floor)  ? -500 :
                0;
        }
        else {
            const c = prefabRef.ref!.addComponent(ZaxisSorter);
            if (!c) throw new Error("fail to add");

            c.runOnce = true;
        }
    }
}
