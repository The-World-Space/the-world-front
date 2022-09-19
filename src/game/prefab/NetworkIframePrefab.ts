import { Vector2 } from "three/src/Three";
import { 
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    CssIframeRenderer,
    GridObjectCollideMap,
    GridCollider,
    IGridCoordinatable,
    GameObject
} from "the-world-engine";
import { Server } from "../connect/types";
import { PenpalConnection } from "../script/penpal/PenpalConnection";
import { ApolloClient } from "@apollo/client";
import { PenpalNetworker } from "../penpal/PenpalNetworker";

export class NetworkIframePrefab extends Prefab {
    private _collideMap: PrefabRef<IGridCoordinatable> = new PrefabRef();

    private _apolloClient: PrefabRef<ApolloClient<any>> = new PrefabRef();
    private _iframeInfo: PrefabRef<Server.IframeGameObject> = new PrefabRef();
    private _worldId: PrefabRef<string> = new PrefabRef();
    private _penpalNetworkWrapper: PrefabRef<PenpalNetworker> = new PrefabRef();
    private _gridObjectCollideMap = new PrefabRef<GridObjectCollideMap>();
    private _colliders = new PrefabRef<Vector2[]>();

    public withGridInfo(collideMap: PrefabRef<IGridCoordinatable>): NetworkIframePrefab {
        this._collideMap = collideMap;
        return this;
    }

    public withApolloClient(client: PrefabRef<ApolloClient<any>>): NetworkIframePrefab {
        this._apolloClient = client;
        return this;
    }

    public withIframeInfo(iframeInfo: PrefabRef<Server.IframeGameObject>): NetworkIframePrefab {
        this._iframeInfo = iframeInfo;
        return this;
    }

    public withWorldId(id: PrefabRef<string>): NetworkIframePrefab {
        this._worldId = id;
        return this;
    }

    public withPenpalNetworkWrapper(value: PrefabRef<PenpalNetworker>): NetworkIframePrefab {
        this._penpalNetworkWrapper = value;
        return this;
    }

    public withCollideInfo(
        gridObjectCollideMap: PrefabRef<GridObjectCollideMap>,
        colliders: PrefabRef<Vector2[]>
    ): NetworkIframePrefab {
        this._gridObjectCollideMap = gridObjectCollideMap;
        this._colliders = colliders;
        return this;
    }

    public make(): GameObjectBuilder {
        const gameObject = new PrefabRef<GameObject>();

        return this.gameObjectBuilder
            .withComponent(CssIframeRenderer, c => {
                const iframe = this._iframeInfo.ref;
                const ref = this._collideMap.ref;
                if (!iframe) throw new Error("iframe info is not given");
                if (!ref) return;
                if (!iframe.proto_) {
                    gameObject.ref!.destroy();
                    return;
                }
                c.iframeSource = iframe.proto_.src;
                c.width = iframe.proto_.width * ref.gridCellWidth;
                c.height = iframe.proto_.height * ref.gridCellHeight;
                c.viewScale = 0.02;
                c.centerOffset = new Vector2(0.5, 0.5);
            })
            .withComponent(GridCollider, c => {
                c.gridObjectCollideMap = this._gridObjectCollideMap.ref;
                if (this._colliders.ref) {
                    for (const point of this._colliders.ref) {
                        c.addCollider(point.x, point.y);
                    }
                }
            })
            .withComponent(PenpalConnection, c => {
                const iframe = this._iframeInfo.ref;
                const client = this._apolloClient.ref;
                const worldId = this._worldId.ref;
                const penpalNetworkWrapper = this._penpalNetworkWrapper.ref;
                if (!client) throw new Error("apollo client is not given");
                if (!worldId) throw new Error("worldId is not given");
                if (!iframe) throw new Error("iframe info is not given");
                if (!penpalNetworkWrapper) throw new Error("penpalNetworkWrapper is not given");
                c.iframeInfo = iframe;
                c.penpalNetworkWrapper = penpalNetworkWrapper;
            })
            .getGameObject(gameObject);
    }
}
