import { Vector2 } from "three";
import { GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";
import { IGridCollidable } from "../script/physics/IGridCollidable";
import { Server } from "../connect/types";
import { IframeRenderer } from "../script/render/IframeRenderer";
import { PenpalConnection } from "../script/penpal/PenpalConnection";
import { ApolloClient } from "@apollo/client";
import { PenpalNetworkWrapper } from "../penpal/PenpalNetworkWrapper";

export class NetworkIframePrefab extends Prefab {
    private _tilemap: PrefabRef<IGridCollidable> = new PrefabRef();

    private _apolloClient: PrefabRef<ApolloClient<any>> = new PrefabRef();
    private _iframeInfo: PrefabRef<Server.IframeGameObject> = new PrefabRef();
    private _worldId: PrefabRef<string> = new PrefabRef();
    private _penpalNetworkWrapper: PrefabRef<PenpalNetworkWrapper> = new PrefabRef();

    public withGridInfo(tilemap: PrefabRef<IGridCollidable>): NetworkIframePrefab {
        this._tilemap = tilemap;
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

    public withPenpalNetworkWrapper(value: PrefabRef<PenpalNetworkWrapper>): NetworkIframePrefab {
        this._penpalNetworkWrapper = value;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(IframeRenderer, c => {
                const iframe = this._iframeInfo.ref;
                const ref = this._tilemap.ref;
                if (!iframe) throw new Error("iframe info is not given");
                if (!ref) return;
                c.iframeSource = iframe.src;
                c.width = iframe.width * ref.gridCellWidth;
                c.height = iframe.height * ref.gridCellHeight;
                c.viewScale = .5;
                c.iframeCenterOffset = new Vector2(0.5, 0.5);
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
            });
    }
}
