import { Component, GameObject, IGridCollidable, PrefabRef } from "the-world-engine";
import { Vector2 } from "three/src/Three";

import { Server } from "../../connect/types";
import { NetworkPlayerPrefab } from "../../prefab/NetworkPlayerPrefab";
import { PlayerGridMovementController } from "../controller/PlayerGridMovementController";
import { PlayerStatusRenderController } from "../controller/PlayerStatusRenderController";
import { PlayerNetworker } from "../networker/PlayerNetworker";

const PREFIX = "@@tw/game/component/spawner/NetworkPlayerManager";

export class NetworkPlayerManager extends Component {
    private readonly _networkPlayerMap: Map<string, GameObject> = new Map();
    private _networkManager: PlayerNetworker | null = null;
    private _iGridCollidable: IGridCollidable | null = null;
    private _localPlayer: GameObject | null = null;

    public initNetwork(networkManager: PlayerNetworker): void {
        this._networkManager = networkManager;
        networkManager.dee.on("join", (user, pos) => {
            this.buildNetworkPlayer(user, pos, networkManager);
        });
        networkManager.dee.on("leave", id => {
            this._networkPlayerMap.get(id)?.destroy();
            this._networkPlayerMap.delete(id);
        });
        networkManager.dee.on("player_chat", (_id, msg) => {
            this._localPlayer?.getComponent(PlayerStatusRenderController)!.setChatBoxText(msg);
        });
        networkManager.dee.on("network_player_chat", (id, msg) => {
            this._networkPlayerMap.get(id)?.getComponent(PlayerStatusRenderController)!.setChatBoxText(msg);
        });
        
    }

    public set iGridCollidable(val: IGridCollidable) {
        this._iGridCollidable = val;
    }

    public initLocalPlayer(player: GameObject): void {
        const component = player.getComponent(PlayerGridMovementController);
        if (!component) throw new Error("no PlayerGridMovementController component");
        
        component.onMoveToTarget.addListener((x, y) => {
            if (component.receiveKeyboardInput) {
                this._networkManager!.dee.emit("player_move", x, y);
            } else {
                this._networkManager!.dee.emit("player_move_forced", x, y);
            }
        });
        
        this._localPlayer = player;
    }

    private buildNetworkPlayer(user: Server.User, pos: Vector2, networkManager: PlayerNetworker): void {
        const instantlater = this.engine.instantiater;
        const posPrefabRef = new PrefabRef<Vector2>(pos);
        const nameRef = new PrefabRef(user.nickname);

        const prefab = 
            instantlater.buildPrefab(`${PREFIX}/player_${user.id}`, NetworkPlayerPrefab)
                .withNetworkManager(networkManager, user.id)
                .withGridInfo(new PrefabRef(this._iGridCollidable))
                .withNameTag(nameRef)
                .withGridPosition(posPrefabRef)
                .with4x4SpriteAtlasFromPath(new PrefabRef(user.skinSrc || "/assets/charactor/Seongwon.png"));

        const builder = prefab.make();
        const prefabRef = new PrefabRef<GameObject>();
        
        builder.getGameObject(prefabRef);
        this._networkPlayerMap.set(user.id, prefabRef.ref!);

        this.gameObject.addChildFromBuilder(builder);
    }
}
