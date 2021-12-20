import { ApolloClient } from "@apollo/client";
import { Quaternion, Vector2, Vector3 } from "three";
import { CssCollideTilemapRenderer } from "./component/physics/CssCollideTilemapRenderer";
import { IframeRenderer } from "./component/render/IframeRenderer";
import { ZaxisSorter } from "./component/render/ZaxisSorter";
import { NetworkPlayerManager } from "./component/gamemanager/NetworkPlayerManager";
import { ServerWorld } from "./connect/types";
import { Bootstrapper } from "./engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { PrefabRef } from "./engine/hierarchy_object/PrefabRef";
import { NetworkManager } from "./engine/NetworkManager";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { User } from "../hooks/useUser";
import { GridInputPrefab } from "./prefab/GridInputPrefab";
import { GridPointer } from "./component/input/GridPointer";
import { NetworkIframeManager } from "./component/gamemanager/NetworkIframeManager";
import { NetworkImageManager } from "./component/gamemanager/NetworkImageManager";
import { PenpalNetworkWrapper } from "./penpal/PenpalNetworkWrapper";

export class NetworkInfoObject {
    private readonly _serverWorld: ServerWorld;
    private readonly _apolloClient: ApolloClient<any>;
    private readonly _networkManager: NetworkManager;
    private readonly _penpalNetworkManager: PenpalNetworkWrapper;
    private readonly _user: User;

    public constructor(serverWorld: ServerWorld, user: User, apolloClient: ApolloClient<any>) {
        this._serverWorld = serverWorld;
        this._apolloClient = apolloClient;
        this._user = user;
        this._networkManager = new NetworkManager(serverWorld.id, user.id, apolloClient);
        this._penpalNetworkManager = new PenpalNetworkWrapper(serverWorld.id, apolloClient);
    }
    
    public get serverWorld(): ServerWorld {
        return this._serverWorld;
    }

    public get apolloClient(): ApolloClient<any> {
        return this._apolloClient;
    }

    public get networkManager(): NetworkManager {
        return this._networkManager;
    }

    public get user(): User {
        return this._user;
    }

    public get penpalNetworkManager(): PenpalNetworkWrapper {
        return this._penpalNetworkManager;
    }
}

export class NetworkBootstrapper extends Bootstrapper<NetworkInfoObject> {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        const player: PrefabRef<GameObject> = new PrefabRef();
        const collideTilemap: PrefabRef<CssCollideTilemapRenderer> = new PrefabRef();
        const gridPointer: PrefabRef<GridPointer> = new PrefabRef();
        
        //@ts-ignore
        globalThis.debug = {
            player: player,
            colideTilemap: collideTilemap,
        }

        return this.sceneBuilder
            .withChild(instantlater.buildGameObject('networkGameManager')
                .withComponent(NetworkPlayerManager, c => {
                    c.initNetwork(this.interopObject!.networkManager);
                    c.initLocalPlayer(player.ref!);
                    c.iGridCollidable = collideTilemap.ref!;
                })
                .withComponent(NetworkIframeManager, c => {
                    c.apolloClient = this.interopObject!.apolloClient;
                    c.iGridCollidable = collideTilemap.ref;
                    c.worldId = this.interopObject!.serverWorld.id;
                    c.iframeList = this.interopObject!.serverWorld.iframes;
                    c.penpalNetworkWrapper = this.interopObject!.penpalNetworkManager;
                })
                .withComponent(NetworkImageManager, c => {
                    c.iGridCollidable = collideTilemap.ref;
                    c.imageList = this.interopObject!.serverWorld.images;
                }))
            .withChild(instantlater.buildGameObject('floor')
                .withComponent(CssCollideTilemapRenderer, c => {
                    c.pointerEvents = false;
                })
                .getComponent(CssCollideTilemapRenderer, collideTilemap))
            .withChild(instantlater.buildPrefab("player", PlayerPrefab, new Vector3(0, 0, 0))
                .with4x4SpriteAtlasFromPath(new PrefabRef(this.interopObject!.user.skinSrc || "/assets/charactor/Seongwon.png"))
                .withCollideMap(collideTilemap)
                .withNameTag(new PrefabRef(this.interopObject!.user.nickname))
                .withPathfindPointer(gridPointer)
                .make()
                .getGameObject(player))

            .withChild(instantlater.buildGameObject("iframe", new Vector3(64, 8, 0), new Quaternion(), new Vector3(0.3, 0.3, 1))
                .withComponent(IframeRenderer, c => {
                    c.iframeSource = "https://www.youtube.com/embed/_6u84iKQxUU";
                    c.width = 640 / 2;
                    c.height = 360 / 2;
                    c.iframeCenterOffset = new Vector2(0, 0.5);
                    // @ts-ignore
                    globalThis.debug.iframe = c.gameObject;
                })
                .withComponent(ZaxisSorter))
            
            
            .withChild(instantlater.buildPrefab("grid_input", GridInputPrefab)
                .withCollideMap(collideTilemap)
                .getGridPointer(gridPointer).make())
                
            .withChild(instantlater.buildPrefab("camera_controller", CameraPrefab)
                .withTrackTarget(player).make());
            
    }
}
