import { ApolloClient } from "@apollo/client";
import {
    Component,
    CssHtmlElementRenderer,
    CssIframeRenderer,
    GameObject,
    GridObjectCollideMap,
    IGridCoordinatable,
    PrefabRef,
    ZaxisSorter
} from "the-world-engine";
import { Vector2, Vector3 } from "three/src/Three";

import { Server } from "../../connect/types";
import { PenpalNetworker } from "../../penpal/PenpalNetworker";
import { IframeIdBoxPrefab } from "../../prefab/IframeIdBoxPrefab";
import { NetworkIframePrefab } from "../../prefab/NetworkIframePrefab";
import { IframeStatusRenderController } from "../controller/IframeStatusRenderController";
import { AdminNetworker } from "../networker/AdminNetworker";
import { IframeNetworker } from "../networker/IframeNetworker";

const PREFIX = "@@tw/game/component/gamemanager/NetworkIframeManager";
const flatTypes = new Set([Server.GameObjectType.Floor, Server.GameObjectType.Effect]);


export class NetworkIframeManager extends Component {
    private readonly _networkIframeMap: Map<number, GameObject> = new Map();

    private _apolloClient: ApolloClient<any> | null = null;
    private _iGridCoordinatable: IGridCoordinatable | null = null;
    private _gridObjectCollideMap: GridObjectCollideMap | null = null;
    private _worldId: string | null = null;
    private _initIframeList: Server.IframeInfo[] = [];
    private _penpalNetworkWrapper: PenpalNetworker | null = null;
    private _iframeNetworker: IframeNetworker | null = null;
    private _adminNetworker: AdminNetworker | null = null;
    private _localPlayerIsAdmin = false;

    private readonly _iframeStatusRenderControllers: IframeStatusRenderController[] = [];
    private readonly _iframeRenderers: CssIframeRenderer[] = [];

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

    public set initIframeList(val: Server.IframeInfo[]) {
        this._initIframeList = [...val];
    }

    public set penpalNetworkWrapper(val: PenpalNetworker) {
        this._penpalNetworkWrapper = val;
    }

    public initNetwork(iframeNetworker: IframeNetworker): void {
        this._iframeNetworker = iframeNetworker;
        this._iframeNetworker.ee.on("create", iframeInfo => {
            this.addOneIframe({ ...iframeInfo, pluginPortMappings: [] }, this._localPlayerIsAdmin);
        });
        this._iframeNetworker.ee.on("delete", iframeId => {
            this.deleteOneIframe(iframeId);
        });
    }

    public initAdminNetwork(adminNetworker: AdminNetworker): void {
        this._adminNetworker = adminNetworker;
        this._adminNetworker.ee.on("amI", () => {
            // i'm admin!
            this.enableIframeStatusRenderControllers();
            this._localPlayerIsAdmin = true;
        });
        this._adminNetworker.ee.on("amnt", () => {
            // i'm not admin!
            this.disableIframeStatusRenderControllers();
            this._localPlayerIsAdmin = false;
        });
    }

    public start(): void {
        this._initIframeList.forEach(info => this.addOneIframe(info, this._localPlayerIsAdmin));
        this._initIframeList = [];
    }

    public addOneIframe(info: Server.IframeInfo, enableStatus: boolean): void {
        if (!this._apolloClient) throw new Error("no apollo client");
        if (!this._worldId) throw new Error("no world id");
        
        this._buildNetworkIframe(info, this._worldId, this._apolloClient, enableStatus);
    }

    public deleteOneIframe(id: number): void {
        const iframe = this._networkIframeMap.get(id);
        if (!iframe) return;
        iframe.destroy();
        this._networkIframeMap.delete(id);
    }

    private _buildNetworkIframe(
        iframeInfo: Server.IframeInfo,
        worldId: string,
        apolloClient: ApolloClient<any>,
        enableStatus: boolean
    ): void {
        const instantlater = this.engine.instantiater;
        const prefabRef = new PrefabRef<GameObject>();
        const gcx = this._iGridCoordinatable?.gridCenterX || 0.5;
        const gcy = this._iGridCoordinatable?.gridCenterY || 0.5;
        const gw = this._iGridCoordinatable?.gridCellWidth || 1;
        const gh = this._iGridCoordinatable?.gridCellHeight || 1;
        
        if (!iframeInfo.proto_) return;
        
        const zindex = 
            (iframeInfo.proto_.type === Server.GameObjectType.Effect) ? 390 :
            (iframeInfo.proto_.type === Server.GameObjectType.Floor)  ? -390 :
            0;

        const calculated =  new Vector3(
            gcx + iframeInfo.x * gw - gw / 2,
            gcy + iframeInfo.y * gh - gh / 2,
            zindex
        );

        const colliders = iframeInfo.proto_.colliders.map(c => new Vector2(c.x, c.y));

        const iframeRenderer = new PrefabRef<CssIframeRenderer>();

        const prefab = 
            instantlater.buildPrefab(`${PREFIX}/iframe_${iframeInfo.id}`, NetworkIframePrefab, calculated)
                .withGridInfo(new PrefabRef(this._iGridCoordinatable))
                .withCollideInfo(new PrefabRef(this._gridObjectCollideMap), new PrefabRef(colliders))
                .withIframeInfo(new PrefabRef(iframeInfo))
                .withApolloClient(new PrefabRef(apolloClient))
                .withPenpalNetworkWrapper(new PrefabRef(this._penpalNetworkWrapper))
                .withWorldId(new PrefabRef(worldId));
        
        const builder = prefab.make();
        builder.getGameObject(prefabRef)
            .getComponent(CssIframeRenderer, iframeRenderer);
        this._networkIframeMap.set(iframeInfo.id, prefabRef.ref!);
        this.gameObject.addChildFromBuilder(builder);

        // Put soter after build
        if (!flatTypes.has(iframeInfo.proto_.type)) {
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
                new Vector3(0, iframeInfo.proto_.height * gh + 2, 0), 
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
        statusRenderController.enabled = enableStatus;

        this._iframeStatusRenderControllers.push(statusRenderController);
        this._iframeRenderers.push(iframeRenderer.ref!);
    }

    private enableIframeStatusRenderControllers(): void {
        this._iframeStatusRenderControllers.forEach(c => c.enabled = true);
    }

    private disableIframeStatusRenderControllers(): void {
        this._iframeStatusRenderControllers.forEach(c => c.enabled = false);
    }

    public enableIframePointerEvents(): void {
        this._iframeRenderers.forEach(c => c.pointerEvents = true);
    }

    public disableIframePointerEvents(): void {
        this._iframeRenderers.forEach(c => c.pointerEvents = false);
    }
}
