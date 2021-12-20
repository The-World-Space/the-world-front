import { ApolloClient } from "@apollo/client";
import { IframeGameObject } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { PrefabRef } from "../../engine/hierarchy_object/PrefabRef";
import { NetworkIframePrefab } from "../../prefab/NetworkIframePrefab";
import { IGridCollidable } from "../physics/IGridCollidable";

const PREFIX = `@@tw/game/component/gamemanager/NetworkIframeManager`

export class NetworkIframeManager extends Component {
    private _networkIframerMap: Map<number, GameObject> = new Map();

    private _apolloClient: ApolloClient<any> | null = null;
    private _iGridCollidable: IGridCollidable | null = null;
    private _worldId: string | null = null;
    private _iframeList: IframeGameObject[] = [];

    public set apolloClient(apolloClient: ApolloClient<any>) {
        this._apolloClient = apolloClient;
    }

    public set iGridCollidable(val: IGridCollidable | null) {
        this._iGridCollidable = val;
    }

    public set worldId(id: string) {
        this._worldId = id;
    }

    public set iframeList(val: IframeGameObject[]) {
        this._iframeList = [...val];
    }

    public start() {
        this._iframeList.forEach(info => this.addOneIframe(info));
    }

    public addOneIframe(info: IframeGameObject) {
        if (!this._apolloClient) throw new Error("no apollo client");
        if (!this._worldId) throw new Error("no world id");
        
        this._iframeList.push(info);
        this._buildNetworkIframe(info, this._worldId, this._apolloClient);
    }

    private _buildNetworkIframe(iframeInfo: IframeGameObject, worldId: string, apolloClient: ApolloClient<any>) {
        const instantlater = this.engine.instantlater;
        const prefabRef = new PrefabRef<GameObject>();
        
        const prefab = 
            instantlater.buildPrefab(`${PREFIX}/iframe_${iframeInfo.id}`, NetworkIframePrefab)
                .withGridInfo(new PrefabRef(this._iGridCollidable))
                .withIframeInfo(new PrefabRef(iframeInfo))
                .withApolloClient(new PrefabRef(apolloClient))
                .withWorldId(new PrefabRef(worldId))
        
        const builder = prefab.make();
        builder.getGameObject(prefabRef);
        this._networkIframerMap.set(iframeInfo.id, prefabRef.ref!);
        this.gameObject.addChildFromBuilder(builder);
    }
}
