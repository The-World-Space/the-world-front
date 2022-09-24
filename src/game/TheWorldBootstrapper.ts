import { ApolloClient } from "@apollo/client";
import {
    Bootstrapper,
    CssTilemapChunkRenderer,
    GameObject,
    GridCollideMap,
    GridObjectCollideMap,
    GridPointer,
    PrefabRef,
    SceneBuilder} from "the-world-engine";
import { Vector3 } from "three/src/Three";

import { User } from "../hooks/useUser";
import { ProtoWebSocket } from "../proto/ProtoWebSocket";
import { AboutPlugins } from "../proto/the_world";
import * as pb from "../proto/the_world";
import { Server } from "./connect/types";
import { PenpalNetworker } from "./penpal/PenpalNetworker";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { GridInputPrefab } from "./prefab/GridInputPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { NetworkBrushManager } from "./script/gamemanager/NetworkBrushManager";
import { NetworkColiderManager } from "./script/gamemanager/NetworkColliderManager";
import { NetworkIframeManager } from "./script/gamemanager/NetworkIframeManager";
import { NetworkImageManager } from "./script/gamemanager/NetworkImageManager";
import { NetworkPlayerManager } from "./script/gamemanager/NetworkPlayerManager";
import { NetworkTileManager } from "./script/gamemanager/NetworkTileManager";
import { GridCenterPositionMatcher } from "./script/helper/GridCenterPositionMatcher";
import { GridBrush } from "./script/input/GridBrush";
import { AdminNetworker } from "./script/networker/AdminNetworker";
import { ColliderNetworker } from "./script/networker/ColliderNetworker";
import { IframeNetworker } from "./script/networker/IframeNetworker";
import { ImageNetworker } from "./script/networker/ImageNetworker";
import { PlayerNetworker } from "./script/networker/PlayerNetworker";
import { TileNetworker } from "./script/networker/TileNetworker";
import { Tool, Tools, WorldEditorConnector } from "./script/WorldEditorConnector";

export class NetworkInfoObject {
    private readonly _colliderNetworker: ColliderNetworker;
    private readonly _iframeNetworker: IframeNetworker;
    private readonly _imageNetworker: ImageNetworker;
    private readonly _tileNetworker: TileNetworker;
    private readonly _adminNetwoker: AdminNetworker;
    public constructor(
        private readonly _serverWorld: Server.World, 
        private readonly _aboutPlugins: AboutPlugins,
        private readonly _user: User, 
        private readonly _apolloClient: ApolloClient<any>,
        private readonly _protoClient: ProtoWebSocket<pb.ServerEvent>,
        private readonly _networkManager: PlayerNetworker, 
        private readonly _penpalNetworkManager: PenpalNetworker,
        private readonly _worldEditorConnector: WorldEditorConnector
    ) {
        this._colliderNetworker = new ColliderNetworker(this._protoClient);
        this._iframeNetworker = new IframeNetworker(this._protoClient);
        this._imageNetworker = new ImageNetworker(this._serverWorld.id, this._apolloClient);
        this._tileNetworker = new TileNetworker(this._protoClient);
        this._adminNetwoker = new AdminNetworker(this._user.id, this._serverWorld.id, this._apolloClient);
    }
    
    public get serverWorld(): Server.World {
        return this._serverWorld;
    }

    public get aboutPlugins(): AboutPlugins {
        return this._aboutPlugins;
    }

    public get apolloClient(): ApolloClient<any> {
        return this._apolloClient;
    }

    public get protoClient(): ProtoWebSocket<pb.ServerEvent> {
        return this._protoClient;
    }

    public get networkManager(): PlayerNetworker {
        return this._networkManager;
    }

    public get user(): User {
        return this._user;
    }

    public get penpalNetworkManager(): PenpalNetworker {
        return this._penpalNetworkManager;
    }

    public get worldEditorConnector(): WorldEditorConnector {
        return this._worldEditorConnector;
    }

    public get colliderNetworker(): ColliderNetworker {
        return this._colliderNetworker;
    }

    public get iframeNetworker(): IframeNetworker {
        return this._iframeNetworker;
    }

    public get imageNetworker(): ImageNetworker {
        return this._imageNetworker;
    }

    public get tileNetworker(): TileNetworker {
        return this._tileNetworker;
    }

    public get adminNetworker(): AdminNetworker {
        return this._adminNetwoker;
    }
}

export class TheWorldBootstrapper extends Bootstrapper<NetworkInfoObject> {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        const player = new PrefabRef<GameObject>();

        //tilemap
        const floorTilemap = new PrefabRef<CssTilemapChunkRenderer>();
        const effectTilemap = new PrefabRef<CssTilemapChunkRenderer>();

        //collideMap
        const gridCollideMap = new PrefabRef<GridCollideMap>();
        const gridObjectCollideMap = new PrefabRef<GridObjectCollideMap>();

        //tool
        const gridPointer = new PrefabRef<GridPointer>();
        const gridBrush = new PrefabRef<GridBrush>();
        const networkBrushManager = new PrefabRef<NetworkBrushManager>();
        const iframeManager = new PrefabRef<NetworkIframeManager>();

        this.interopObject!.worldEditorConnector.action = {
            setToolType(tool: Tool): void {
                networkBrushManager.ref?.setCurrentTool(tool);

                if (tool instanceof Tools.Collider || tool instanceof Tools.EraseCollider) {
                    if (gridCollideMap.ref) {
                        gridCollideMap.ref.showCollider = true;
                    }
                    if (iframeManager.ref) {
                        iframeManager.ref.disableIframePointerEvents();
                    }
                } else {
                    if (gridCollideMap.ref) {
                        gridCollideMap.ref.showCollider = false;
                    }
                }
                    
                if (tool instanceof Tools.None) {
                    if (iframeManager.ref) {
                        iframeManager.ref.enableIframePointerEvents();
                    }
                } else {
                    if (iframeManager.ref) {
                        iframeManager.ref.disableIframePointerEvents();
                    }
                }

                if (tool instanceof Tools.IframeGameObject || tool instanceof Tools.EraseIframeObject
                    || tool instanceof Tools.ImageGameObject || tool instanceof Tools.EraseImageObject) {
                    if (gridObjectCollideMap.ref) {
                        gridObjectCollideMap.ref.showCollider = true;
                    }
                } else {
                    if (gridObjectCollideMap.ref) {
                        gridObjectCollideMap.ref.showCollider = false;
                    }
                }

                if (tool instanceof Tools.None) {
                    gridBrush.ref?.clearImage();
                } else if (tool instanceof Tools.Collider) {
                    if (gridBrush.ref) {
                        if (!gridBrush.ref.gridCellWidth) throw new Error("Unreachable");
                        if (!gridBrush.ref.gridCellHeight) throw new Error("Unreachable");
                        gridBrush.ref.setImage(
                            "/assets/tilemap/default.png",
                            gridBrush.ref.gridCellWidth, 
                            gridBrush.ref.gridCellHeight
                        );
                    }
                } else if (tool instanceof Tools.EraseCollider) {
                    gridBrush.ref?.clearImage();
                } else if (tool instanceof Tools.IframeGameObject) {
                    if (gridBrush.ref) {
                        if (!gridBrush.ref.gridCellWidth) throw new Error("Unreachable");
                        if (!gridBrush.ref.gridCellHeight) throw new Error("Unreachable");
                        gridBrush.ref.setImage(
                            "/assets/tilemap/default.png",
                            tool.iframeInfo.width * gridBrush.ref.gridCellWidth, 
                            tool.iframeInfo.height * gridBrush.ref.gridCellHeight
                        );
                    }
                } else if (tool instanceof Tools.EraseIframeObject || tool instanceof Tools.EraseImageObject) {
                    gridBrush.ref?.clearImage();
                } else if (tool instanceof Tools.ImageGameObject) {
                    if (gridBrush.ref) {
                        if (!gridBrush.ref.gridCellWidth) throw new Error("Unreachable");
                        if (!gridBrush.ref.gridCellHeight) throw new Error("Unreachable");
                        gridBrush.ref.setImage(
                            tool.imageInfo.src,
                            tool.imageInfo.width * gridBrush.ref.gridCellWidth, 
                            tool.imageInfo.height * gridBrush.ref.gridCellHeight
                        );
                    }
                } else if (tool instanceof Tools.Tile) {
                    if (gridBrush.ref) {
                        if (!gridBrush.ref.gridCellWidth) throw new Error("Unreachable");
                        if (!gridBrush.ref.gridCellHeight) throw new Error("Unreachable");
                        gridBrush.ref.setImageFromAtlas(
                            tool.tileInfo.atlas.src,
                            tool.tileInfo.atlas.rowCount,
                            tool.tileInfo.atlas.columnCount,
                            tool.tileInfo.atlasIndex,
                            gridBrush.ref.gridCellWidth, 
                            gridBrush.ref.gridCellHeight
                        );
                    }
                } else if (tool instanceof Tools.EraseTile) {
                    gridBrush.ref?.clearImage();
                }
            }
        };

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("gamemanager")
                .withComponent(NetworkPlayerManager, c => {
                    c.iGridCollidable = gridCollideMap.ref!;
                    c.initNetwork(this.interopObject!.networkManager);
                    c.initLocalPlayer(player.ref!);
                })
                .withComponent(NetworkIframeManager, c => {
                    c.apolloClient = this.interopObject!.apolloClient;
                    c.iGridCoordinatable = gridCollideMap.ref;
                    c.gridObjectCollideMap = gridObjectCollideMap.ref;
                    c.worldId = this.interopObject!.serverWorld.id;

                    c.initIframeList = this.interopObject!.serverWorld.iframes.map(iframe => (
                        {
                            ...iframe,
                            pluginPortMappings:
                                this.interopObject!.aboutPlugins.iframePluginPortMappings
                                    .filter(({ iframeId }) => iframeId === iframe.id)
                                    .map(({ id: mappingId, portId, pluginId }) => (
                                        {
                                            id: mappingId,
                                            portId: portId,
                                            plugin: (
                                                this.interopObject!.aboutPlugins.localPlugins.find(({ id }) => id === pluginId)
                                                ??
                                                this.interopObject!.aboutPlugins.localPlugins.find(({ id }) => id === pluginId)
                                            )!
                                        }
                                    ))
                        }
                    ));
                    c.penpalNetworkWrapper = this.interopObject!.penpalNetworkManager;
                    c.initNetwork(this.interopObject!.iframeNetworker);
                    c.initAdminNetwork(this.interopObject!.adminNetworker);
                })
                .withComponent(NetworkImageManager, c => {
                    c.iGridCollidable = gridCollideMap.ref;
                    c.gridObjectCollideMap = gridObjectCollideMap.ref;
                    c.initImageList = this.interopObject!.serverWorld.images;
                    c.initNetwork(this.interopObject!.imageNetworker);
                })
                .withComponent(NetworkColiderManager, c => {
                    c.initColliderList = this.interopObject!.serverWorld.colliders;
                    c.worldGridColliderMap = gridCollideMap;
                    c.initNetwork(this.interopObject!.colliderNetworker);
                })
                .withComponent(NetworkBrushManager, c => {
                    c.gridBrush = gridBrush.ref!;
                    c.apolloClient = this.interopObject!.apolloClient;
                    c.protoClient = this.interopObject!.protoClient;
                    c.worldId = this.interopObject!.serverWorld.id;
                })
                .withComponent(NetworkTileManager, c => {
                    c.floorTileMap = floorTilemap.ref!;
                    c.effectTileMap = effectTilemap.ref!;
                    c.initTileList = this.interopObject!.serverWorld.atlasInfoScalar;
                    c.tileNetworker = this.interopObject!.tileNetworker;
                })
                .getComponent(NetworkBrushManager, networkBrushManager)
                .getComponent(NetworkIframeManager, iframeManager))

            .withChild(instantiater.buildGameObject("tilemap")
            //.withComponent(CameraRelativeZaxisSorter, c => c.offset = -500)

                .withChild(instantiater.buildGameObject("floor", new Vector3(0, 0, -400))
                    .withComponent(CssTilemapChunkRenderer, c => {
                        c.pointerEvents = false;
                        c.chunkSize = 16 * 2;
                    })
                    .getComponent(CssTilemapChunkRenderer, floorTilemap))
                    
                .withChild(instantiater.buildGameObject("effect", new Vector3(0, 0, 400))
                    .withComponent(CssTilemapChunkRenderer, c => {
                        c.pointerEvents = false;
                        c.chunkSize = 16 * 2;
                    })
                    .getComponent(CssTilemapChunkRenderer, effectTilemap)))

            .withChild(instantiater.buildGameObject("collide_map")
                .withComponent(GridCollideMap)
                .withComponent(GridObjectCollideMap)
                .withComponent(GridCenterPositionMatcher, c => c.setGridCenter(floorTilemap.ref!.gridCenter))
                .getComponent(GridCollideMap, gridCollideMap)
                .getComponent(GridObjectCollideMap, gridObjectCollideMap))

            .withChild(instantiater.buildPrefab("player", PlayerPrefab)
                .with4x4SpriteAtlasFromPath(new PrefabRef(this.interopObject!.user.skinSrc || "/assets/charactor/Seongwon.png"))
                .withCollideMap(gridCollideMap)
                .withCollideMap(gridObjectCollideMap)
                .withNameTag(new PrefabRef(this.interopObject!.user.nickname))
                .withPathfindPointer(gridPointer)
                .make()
                .getGameObject(player))
            
            .withChild(instantiater.buildPrefab("grid_input", GridInputPrefab, new Vector3(0, 0, -500))
                .withCollideMap(gridCollideMap)
                .getGridPointer(gridPointer).make()
                .withComponent(GridBrush, c => c.imageZoffset = 1010)
                .getComponent(GridBrush, gridBrush))
                
            .withChild(instantiater.buildPrefab("camera_controller", CameraPrefab)
                .withTrackTarget(player).make());
    }
}
