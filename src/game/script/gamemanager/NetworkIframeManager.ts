import { ApolloClient } from "@apollo/client";
import { Vector2, Vector3 } from "three";
import { Server } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { PrefabRef } from "../../engine/hierarchy_object/PrefabRef";
import { PenpalNetworker } from "../../penpal/PenpalNetworker";
import { IframeIdBoxPrefab } from "../../prefab/IframeIdBoxPrefab";
import { NetworkIframePrefab } from "../../prefab/NetworkIframePrefab";
import { IframeStatusRenderController } from "../controller/IframeStatusRenderController";
import { IframeNetworker } from "../networker/IframeNetworker";
import { GridObjectCollideMap } from "../physics/GridObjectCollideMap";
import { IGridCoordinatable } from "../post_render/IGridCoordinatable";
import { CameraRelativeZaxisSorter } from "../render/CameraRelativeZaxisSorter";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";
import { ZaxisSorter } from "../render/ZaxisSorter";

const PREFIX = "@@tw/game/component/gamemanager/NetworkIframeManager";
const flatTypes = new Set([Server.GameObjectType.Floor, Server.GameObjectType.Effect]);

export class NetworkIframeManager extends Component {
    private _networkIframerMap: Map<number, GameObject> = new Map();

    private _apolloClient: ApolloClient<any> | null = null;
    private _iGridCoordinatable: IGridCoordinatable | null = null;
    private _gridObjectCollideMap: GridObjectCollideMap | null = null;
    private _worldId: string | null = null;
    private _initIframeList: Server.IframeGameObject[] = [];
    private _penpalNetworkWrapper: PenpalNetworker | null = null;
    private _iframeNetworker: IframeNetworker | null = null;

    public set apolloClient(apolloClient: ApolloClient<any>) {
        this._apolloClient = apolloClient;
    }

    public set iGridCoordinatable(val: IGridCoordinatable | null) {
        this._iGridCoordinatable = val;
    }

    public set gridObjectCollideMap(val: GridObjectCollideMap | null) {
        this._gridObjectCollideMap = val;
    }

    public set worldId(id: string) {
        this._worldId = id;
    }

    public set initIframeList(val: Server.IframeGameObject[]) {
        this._initIframeList = [...val];
    }

    public set penpalNetworkWrapper(val: PenpalNetworker) {
        this._penpalNetworkWrapper = val;
    }

    public initNetwork(iframeNetworker: IframeNetworker): void {
        this._iframeNetworker = iframeNetworker;
        this._iframeNetworker.ee.on("create", iframeInfo => {
            this.addOneIframe(iframeInfo);
        });
        this._iframeNetworker.ee.on("delete", iframeId => {
            this.deleteOneIframe(iframeId);
        });
    }

    public start(): void {
        this._initIframeList.forEach(info => this.addOneIframe(info));
        this._initIframeList = [];
    }

    public addOneIframe(info: Server.IframeGameObject): void {
        if (!this._apolloClient) throw new Error("no apollo client");
        if (!this._worldId) throw new Error("no world id");
        
        this._buildNetworkIframe(info, this._worldId, this._apolloClient);
    }

    public deleteOneIframe(id: number): void {
        const iframe = this._networkIframerMap.get(id);
        if (!iframe) return;
        iframe.destroy();
        this._networkIframerMap.delete(id);
    }

    private _buildNetworkIframe(iframeInfo: Server.IframeGameObject, worldId: string, apolloClient: ApolloClient<any>): void {
        const instantlater = this.engine.instantlater;
        const prefabRef = new PrefabRef<GameObject>();
        const gcx = this._iGridCoordinatable?.gridCenterX || 8;
        const gcy = this._iGridCoordinatable?.gridCenterY || 8;
        const gw = this._iGridCoordinatable?.gridCellWidth || 16;
        const gh = this._iGridCoordinatable?.gridCellHeight || 16;
        const calculated =  new Vector3(
            gcx + iframeInfo.x * gw - gw / 2,
            gcy + iframeInfo.y * gh - gh / 2, 1);
        
        if (!iframeInfo.proto_) return;
        const colliders = iframeInfo.proto_.colliders.map(c => new Vector2(c.x, c.y));

        const prefab = 
            instantlater.buildPrefab(`${PREFIX}/iframe_${iframeInfo.id}`, NetworkIframePrefab, calculated)
                .withGridInfo(new PrefabRef(this._iGridCoordinatable))
                .withCollideInfo(new PrefabRef(this._gridObjectCollideMap), new PrefabRef(colliders))
                .withIframeInfo(new PrefabRef(iframeInfo))
                .withApolloClient(new PrefabRef(apolloClient))
                .withPenpalNetworkWrapper(new PrefabRef(this._penpalNetworkWrapper))
                .withWorldId(new PrefabRef(worldId));
        
        const builder = prefab.make();
        builder.getGameObject(prefabRef);
        this._networkIframerMap.set(iframeInfo.id, prefabRef.ref!);
        this.gameObject.addChildFromBuilder(builder);

        // Put soter after build
        if (flatTypes.has(iframeInfo.proto_.type)) {
            const c = prefabRef.ref!.addComponent(CameraRelativeZaxisSorter);
            if (!c) throw new Error("fail to add");
            c.offset =
                (iframeInfo.proto_.type === Server.GameObjectType.Effect) ? 100 :
                (iframeInfo.proto_.type === Server.GameObjectType.Floor)  ? -500 :
                0;
        }
        else {
            const c = prefabRef.ref!.addComponent(ZaxisSorter);
            if (!c) throw new Error("fail to add");

            c.runOnce = true;
        }

        const idBoxObject = new PrefabRef<GameObject>();
        const idBoxRenderer = new PrefabRef<CssHtmlElementRenderer>();

        prefabRef.ref!.addChildFromBuilder(
            instantlater.buildPrefab(
                "id_box", 
                IframeIdBoxPrefab, 
                new Vector3(0, iframeInfo.proto_.height * gh + 8, 0), 
                undefined,
                new Vector3(0.4, 0.4, 0.4))
                .getIdBoxObject(idBoxObject)
                .getIdBoxRenderer(idBoxRenderer).make()
                .active(false)
        );
        const statusRenderController = prefabRef.ref!.addComponent(IframeStatusRenderController);
        if (!statusRenderController) throw new Error("fail to add");
        statusRenderController.setIdBoxObject(idBoxObject.ref!);
        statusRenderController.setIdBoxRenderer(idBoxRenderer.ref!);
        statusRenderController.setIdBoxText(iframeInfo.id);
        //statusRenderController.enabled = false;
    }
}
