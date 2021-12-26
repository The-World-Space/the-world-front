import { Server } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { PrefabRef } from "../../engine/hierarchy_object/PrefabRef";
import { ColliderNetworker } from "../networker/ColliderNetworker";
import { GridCollideMap } from "../physics/GridColideMap";

export class NetworkColiderManager extends Component {
    private _colliderList: Server.Collider[] = [];
    private _worldGridColliderMap: PrefabRef<GridCollideMap> = new PrefabRef();
    private _colliderNetworker: ColliderNetworker | null = null;

    public set colliderList(val: Server.Collider[]) {
        this._colliderList = [...val];
    }

    public set worldGridColliderMap(val: PrefabRef<GridCollideMap>) {
        this._worldGridColliderMap = val;
    }

    public initNetwork(val: ColliderNetworker): void {
        this._colliderNetworker = val;
        this._colliderNetworker.ee.on("update", collider => {
            this.addOneCollider(collider);
        });
    }

    public start(): void {
        this._colliderList.forEach(info => this.addOneCollider(info));
    }

    public addOneCollider(info: Server.Collider): void {
        this._colliderList.push(info);
        this._buildNetworkIframe(info);
    }

    private _buildNetworkIframe(colliderInfo: Server.Collider): void {
        if (!this._worldGridColliderMap.ref) throw new Error("worldGridColliderMap is null");
        
        if (colliderInfo.isBlocked)
            this._worldGridColliderMap.ref.addCollider(colliderInfo.x, colliderInfo.y);
        else
            this._worldGridColliderMap.ref.removeCollider(colliderInfo.x, colliderInfo.y);
    }
}
