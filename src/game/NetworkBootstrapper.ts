import { ApolloClient } from "@apollo/client";
import { Quaternion, Vector2, Vector3 } from "three";
import { PenpalConnection } from "./component/penpal/PenpalConnection";
import { CssCollideTilemapRenderer } from "./component/physics/CssCollideTilemapRenderer";
import { CssSpriteRenderer } from "./component/render/CssSpriteRenderer";
import { IframeRenderer } from "./component/render/IframeRenderer";
import { ZaxisSorter } from "./component/render/ZaxisSorter";
import { NetworkPlayerManager } from "./component/gamemanager/NetworkPlayerManager";
import { GameObjectType, ServerWorld } from "./connect/types";
import { Bootstrapper } from "./engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { PrefabRef } from "./engine/hierarchy_object/PrefabRef";
import { NetworkManager } from "./engine/NetworkManager";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { User } from "../hooks/useUser";
import { CameraRelativeZaxisSorter } from "./component/render/CameraRelativeZaxisSorter";
import { GridInputPrefab } from "./prefab/GridInputPrefab";
import { GridPointer } from "./component/input/GridPointer";

const PREFIX = '@@twp/game/NetworkBootstrapper/';

export class NetworkInfoObject {
    private readonly _serverWorld: ServerWorld;
    private readonly _apolloClient: ApolloClient<any>;
    private readonly _networkManager: NetworkManager;
    private readonly _user: User;

    public constructor(serverWorld: ServerWorld, user: User, apolloClient: ApolloClient<any>) {
        this._serverWorld = serverWorld;
        this._apolloClient = apolloClient;
        this._user = user;
        this._networkManager = new NetworkManager(serverWorld.id, user.id, apolloClient);
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
}

export class NetworkBootstrapper extends Bootstrapper<NetworkInfoObject> {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        const player: PrefabRef<GameObject> = new PrefabRef();
        const collideTilemap: PrefabRef<CssCollideTilemapRenderer> = new PrefabRef();
        const gridPointer: PrefabRef<GridPointer> = new PrefabRef();

        this.interopObject!.serverWorld.iframes.forEach((iframe, idx) => {
            this.sceneBuilder
                .withChild(instantlater.buildGameObject(PREFIX + `iframe_${idx}`, new Vector3(0, 0, 0), new Quaternion(), new Vector3(1, 1, 1))
                    .withComponent(IframeRenderer, c => {
                        const ref = collideTilemap.ref;
                        if (!ref) return;
                        c.iframeSource = iframe.src;
                        c.width = iframe.width * ref.gridCellWidth;
                        c.height = iframe.height * ref.gridCellHeight;
                        c.viewScale = .5;
                        c.iframeCenterOffset = new Vector2(0.5, 0.5);
                        
                        c.gameObject.transform.position.set(
                            ref.gridCenterX + iframe.x * ref.gridCellWidth - ref.gridCellWidth / 2,
                            ref.gridCenterY + iframe.y * ref.gridCellHeight, 1);
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
                        c.setApolloClient(this.interopObject!.apolloClient);
                        c.setIframeInfo(iframe);
                        c.setWorldId(this.interopObject!.serverWorld.id);
                    }));
        });

        const flatTypes = new Set([GameObjectType.Floor, GameObjectType.Effect]);
        this.interopObject!.serverWorld.images.forEach((image, idx) => {
            this.sceneBuilder
                .withChild(instantlater.buildGameObject(PREFIX + `image_${idx}`, new Vector3(0, 0, 0), new Quaternion(), new Vector3(1, 1, 1))
                    .withComponent(CssSpriteRenderer, c => {
                        const ref = collideTilemap.ref;
                        if (!ref) return;
                        c.imagePath = image.src;
                        // @TODO: image height / width
                        c.imageHeight = image.height * ref.gridCellHeight;
                        c.imageWidth = image.width * ref.gridCellWidth;
                        c.imageCenterOffset = new Vector2(0.5, 0.5);
                        c.gameObject.transform.position.set(
                            ref.gridCenterX + image.x * ref.gridCellWidth - ref.gridCellWidth / 2, 
                            ref.gridCenterY + image.y * ref.gridCellHeight, 1);
                    })
                    .withComponent(ZaxisSorter, c => {
                        if (flatTypes.has(image.type))
                            c.gameObject.removeComponent(c);
                        
                        c.runOnce = true;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => {
                        if (!flatTypes.has(image.type))
                            c.gameObject.removeComponent(c);
                        
                        c.offset = 
                            (image.type === GameObjectType.Effect) ? 100 :
                            (image.type === GameObjectType.Floor)  ? -100 :
                            0;
                    }));
        });
        
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
                }))
            .withChild(instantlater.buildGameObject('floor')
                .withComponent(CssCollideTilemapRenderer, c => {
                    c.pointerEvents = false;
                })
                .getComponent(CssCollideTilemapRenderer, collideTilemap))
            .withChild(instantlater.buildPrefab("player", PlayerPrefab, new Vector3(0, 0, 0))
                .with4x4SpriteAtlasFromPath(new PrefabRef("/assets/charactor/Seongwon.png"))
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
