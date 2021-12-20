import { Vector2 } from "three";
import { ZaxisSorter } from "../component/render/ZaxisSorter";
import { GameObjectBuilder } from "../engine/hierarchy_object/GameObject";
import { Prefab } from "../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../engine/hierarchy_object/PrefabRef";
import { IGridCollidable } from "../component/physics/IGridCollidable";
import { GameObjectType, IframeGameObject } from "../connect/types";
import { IframeRenderer } from "../component/render/IframeRenderer";
import { CameraRelativeZaxisSorter } from "../component/render/CameraRelativeZaxisSorter";
import { PenpalConnection } from "../component/penpal/PenpalConnection";
import { ApolloClient } from "@apollo/client";

const flatTypes = new Set([GameObjectType.Floor, GameObjectType.Effect]);

export class NetworkIframePrefab extends Prefab {
    private _tilemap: PrefabRef<IGridCollidable> = new PrefabRef();

    private _apolloClient: PrefabRef<ApolloClient<any>> = new PrefabRef();
    private _iframeInfo: PrefabRef<IframeGameObject> = new PrefabRef();
    private _worldId: PrefabRef<string> = new PrefabRef();

    public withGridInfo(tilemap: PrefabRef<IGridCollidable>): NetworkIframePrefab {
        this._tilemap = tilemap;
        return this;
    }

    public withApolloClient(client: PrefabRef<ApolloClient<any>>): NetworkIframePrefab {
        this._apolloClient = client;
        return this;
    }

    public withIframeInfo(iframeInfo: PrefabRef<IframeGameObject>): NetworkIframePrefab {
        this._iframeInfo = iframeInfo;
        return this;
    }

    public withWorldId(id: PrefabRef<string>): NetworkIframePrefab {
        this._worldId = id;
        return this;
    }

    public make(): GameObjectBuilder {
        const iframe = this._iframeInfo.ref;
        const client = this._apolloClient.ref;
        const worldId = this._worldId.ref;

        if (!iframe) throw new Error("iframe info is not given");
        if (!client) throw new Error("apollo client is not given");
        if (!worldId) throw new Error("worldId is not given");

        return this.gameObjectBuilder
            .withComponent(IframeRenderer, c => {
                const ref = this._tilemap.ref;
                if (!ref) return;
                c.iframeSource = iframe.src;
                c.width = iframe.width * ref.gridCellWidth;
                c.height = iframe.height * ref.gridCellHeight;
                c.viewScale = .5;
                c.iframeCenterOffset = new Vector2(0.5, 0.5);
                
                c.gameObject.transform.position.set(
                    ref.gridCenterX + iframe.x * ref.gridCellWidth - ref.gridCellWidth / 2,
                    ref.gridCenterY + iframe.y * ref.gridCellHeight - ref.gridCellHeight / 2, 1);
            })
            .withComponent(ZaxisSorter, c => {
                if (flatTypes.has(iframe.type))
                    c.gameObject.removeComponent(c);
                
                c.runOnce = true;
            })
            .withComponent(CameraRelativeZaxisSorter, c => {
                if (!flatTypes.has(iframe.type))
                    c.gameObject.removeComponent(c);
                
                c.offset =
                    (iframe.type === GameObjectType.Effect) ? 100 :
                    (iframe.type === GameObjectType.Floor)  ? -500 :
                    0;
            })
            .withComponent(PenpalConnection, c => {
                if (!this._apolloClient || !this._worldId) return;
                c.setApolloClient(client);
                c.setIframeInfo(iframe);
                c.setWorldId(worldId);
            });
    }
}
