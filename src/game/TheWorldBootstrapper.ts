import { ApolloClient } from "@apollo/client";
import { Quaternion, Vector2, Vector3 } from "three";
import { CssCollideTilemapRenderer } from "./script/physics/CssCollideTilemapRenderer";
import { IframeRenderer } from "./script/render/IframeRenderer";
import { ZaxisSorter } from "./script/render/ZaxisSorter";
import { NetworkPlayerManager } from "./script/gamemanager/NetworkPlayerManager";
import { Server } from "./connect/types";
import { Bootstrapper } from "./engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { PrefabRef } from "./engine/hierarchy_object/PrefabRef";
import { Networker } from "./script/Networker";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { User } from "../hooks/useUser";
import { GridInputPrefab } from "./prefab/GridInputPrefab";
import { GridPointer } from "./script/input/GridPointer";
import { NetworkIframeManager } from "./script/gamemanager/NetworkIframeManager";
import { NetworkImageManager } from "./script/gamemanager/NetworkImageManager";
import { PenpalNetworker } from "./penpal/PenpalNetworker";
import { WorldEditorConnector } from "./script/WorldEditorConnector";
import { GridCollideMap } from "./script/physics/GridColideMap";
import { GridCenterPositionMatcher } from "./script/helper/GridCenterPositionMatcher";
import { NetworkColiderManager } from "./script/gamemanager/NetworkColliderManager";

export class NetworkInfoObject {
    public constructor(
        private readonly _serverWorld: Server.World, 
        private readonly _user: User, 
        private readonly _apolloClient: ApolloClient<any>, 
        private readonly _networkManager: Networker, 
        private readonly _penpalNetworkManager: PenpalNetworker,
        private readonly _worldEditorConnector: WorldEditorConnector) {
    }
    
    public get serverWorld(): Server.World {
        return this._serverWorld;
    }

    public get apolloClient(): ApolloClient<any> {
        return this._apolloClient;
    }

    public get networkManager(): Networker {
        return this._networkManager;
    }

    public get user(): User {
        return this._user;
    }

    public get penpalNetworkManager(): PenpalNetworker {
        return this._penpalNetworkManager;
    }
}

export class TheWorldBootstrapper extends Bootstrapper<NetworkInfoObject> {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        const player: PrefabRef<GameObject> = new PrefabRef();
        const collideTilemap: PrefabRef<CssCollideTilemapRenderer> = new PrefabRef();
        const worldGridCollideMap: PrefabRef<GridCollideMap> = new PrefabRef();
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
                })
                .withComponent(NetworkColiderManager, c => {
                    c.worldId = this.interopObject!.serverWorld.id;
                    c.colliderList = this.interopObject!.serverWorld.colliders;
                    // worldGridCollideMap.ref!.showCollider = true;
                    c.worldGridColliderMap = worldGridCollideMap;
                }))
            .withChild(instantlater.buildGameObject('css_collide_tilemap_center')
                .withComponent(CssCollideTilemapRenderer, c => {
                    c.pointerEvents = false;
                })
                .getComponent(CssCollideTilemapRenderer, collideTilemap))
            .withChild(instantlater.buildGameObject('grid_collide_map_center')
                .withComponent(GridCollideMap)
                .withComponent(GridCenterPositionMatcher, c => {
                    c.setGridCenter(collideTilemap.ref!.gridCenter);
                })
                .getComponent(GridCollideMap, worldGridCollideMap))
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
