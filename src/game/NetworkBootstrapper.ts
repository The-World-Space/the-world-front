import { ApolloClient } from "@apollo/client";
import { Quaternion, Vector2, Vector3 } from "three";
import { CssCollideTilemapRenderer } from "./component/physics/CssCollideTilemapRenderer";
import { CssSpriteRenderer } from "./component/render/CssSpriteRenderer";
import { IframeRenderer } from "./component/render/IframeRenderer";
import { ZaxisInitializer } from "./component/render/ZaxisInitializer";
import { ZaxisSorter } from "./component/render/ZaxisSorter";
import { NetworkSpawnner } from "./component/spawner/NetworkSpawnner";
import { GameObjectType, ServerWorld } from "./connect/types";
import { Bootstrapper } from "./engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "./engine/bootstrap/SceneBuilder";
import { GameObject } from "./engine/hierarchy_object/GameObject";
import { PrefabRef } from "./engine/hierarchy_object/PrefabRef";
import { NetworkManager } from "./engine/NetworkManager";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";

const PREFIX = '@@twp/game/NetworkBootstrapper/';
const SIZE = 16;

export class NetworkInfoObject {
    private readonly _serverWorld: ServerWorld;
    private readonly _apolloClient: ApolloClient<any>;
    private readonly _networkManager: NetworkManager;

    public constructor(serverWorld: ServerWorld, apolloClient: ApolloClient<any>) {
        this._serverWorld = serverWorld;
        this._apolloClient = apolloClient;
        this._networkManager = new NetworkManager(serverWorld.id, apolloClient);
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
}

export class NetworkBootstrapper extends Bootstrapper<NetworkInfoObject> {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;

        let player: PrefabRef<GameObject> = new PrefabRef();
        let colideTilemap: PrefabRef<CssCollideTilemapRenderer> = new PrefabRef();

        // @ts-ignore
        globalThis.debug = this.sceneBuilder

        this.interopObject!.serverWorld.iframes.forEach((iframe, idx) => {
            this.sceneBuilder
                .withChild(instantlater.buildGameObject(PREFIX + `iframe_${idx}`, new Vector3(0, 0, 0), new Quaternion(), new Vector3(1, 1, 1))
                    .withComponent(IframeRenderer, c => {
                        c.iframeSource = iframe.src;
                        c.width = iframe.width * SIZE;
                        c.height = iframe.height * SIZE;
                        c.gameObject.transform.position.set(iframe.x, iframe.y, 1);
                        c.gameObject.transform.position.multiplyScalar(SIZE);
                        if (iframe.type === GameObjectType.Effect) {
                            c.gameObject.transform.position.z += 10;
                        }
                        else if (iframe.type === GameObjectType.Floor) {
                            c.gameObject.transform.position.z -= 10;
                        }
                    })
                    .withComponent(ZaxisInitializer));
        });

        this.interopObject!.serverWorld.images.forEach((image, idx) => {
            this.sceneBuilder
                .withChild(instantlater.buildGameObject(PREFIX + `image_${idx}`, new Vector3(0, 0, 0), new Quaternion(), new Vector3(1, 1, 1))
                    .withComponent(CssSpriteRenderer, c => {
                        c.imagePath = image.src;
                        // @TODO: image height / width
                        c.gameObject.transform.position.set(image.x, image.y, 1);
                        c.gameObject.transform.position.multiplyScalar(SIZE);
                        if (image.type === GameObjectType.Effect) {
                            c.gameObject.transform.position.z += 10;
                        }
                        else if (image.type === GameObjectType.Floor) {
                            c.gameObject.transform.position.z -= 10;
                        }
                    })
                    .withComponent(ZaxisInitializer));
        });
        

        return this.sceneBuilder
            .withChild(instantlater.buildGameObject('networkGameManager')
                .withComponent(NetworkSpawnner, c => {
                    c.initNetwork(this.interopObject!.networkManager);
                }))
            .withChild(instantlater.buildPrefab("player", PlayerPrefab, new Vector3(0, 0, 0))
                .with4x4SpriteAtlasFromPath(new PrefabRef("/assets/charactor/Seongwon.png"))
                .withCollideMap(colideTilemap)
                .make()
                .getGameObject(player))

            .withChild(instantlater.buildGameObject("iframe", new Vector3(64, 4, 0), new Quaternion(), new Vector3(0.3, 0.3, 1))
                .withComponent(IframeRenderer, c => {
                    c.iframeSource = "https://www.youtube.com/embed/_6u84iKQxUU";
                    c.width = 640 / 2;
                    c.height = 360 / 2;
                    c.iframeCenterOffset = new Vector2(0, 0.5);
                })
                .withComponent(ZaxisSorter))
            
            .withChild(instantlater.buildPrefab("camera_controller", CameraPrefab)
                .withTrackTarget(player).make())
            
    }
}
