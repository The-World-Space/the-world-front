import { Vector2 } from "three";
import { Server } from "../../connect/types";
import { Component } from "../../engine/hierarchy_object/Component";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { PrefabRef } from "../../engine/hierarchy_object/PrefabRef";
import { PlayerNetworker } from "../networker/PlayerNetworker";
import { NetworkPlayerPrefab } from "../../prefab/NetworkPlayerPrefab";
import { PlayerGridMovementController } from "../controller/PlayerGridMovementController";
import { IGridCollidable } from "../../engine/script/physics/IGridCollidable";
import { PlayerStatusRenderController } from "../controller/PlayerStatusRenderController";

const PREFIX = "@@tw/game/component/spawner/NetworkPlayerManager";

export class NetworkPlayerManager extends Component {
    private _networkPlayerMap: Map<string, GameObject> = new Map();
    private _networkManager: PlayerNetworker | null = null;
    private _iGridCollidable: IGridCollidable | null = null;
    private _localPlayer: GameObject | null = null;

    public initNetwork(networkManager: PlayerNetworker): void {
        this._networkManager = networkManager;
        networkManager.dee.on("join", (user, pos) => {
            this._buildNetworkPlayer(user, pos, networkManager);
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
        
        component.addOnMoveToTargetEventListener((x, y) => {
            this._networkManager!.dee.emit("player_move", x, y);
        });
        
        this._localPlayer = player;
    }

    private _buildNetworkPlayer(user: Server.User, pos: Vector2, networkManager: PlayerNetworker) {
        const instantlater = this.engine.instantlater;
        const posPrefabRef = new PrefabRef<Vector2>(pos);
        const nameRef = new PrefabRef(user.nickname);

        const prefab = 
            instantlater.buildPrefab(`${PREFIX}/player_${user.id}`, NetworkPlayerPrefab)
                .withUserId(user.id)
                .withNetworkManager(networkManager)
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
