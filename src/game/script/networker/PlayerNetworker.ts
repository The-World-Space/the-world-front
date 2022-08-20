import { TypedEmitter, DumbTypedEmitter } from "detail-typed-emitter";
import { Vector2 } from "three";
import { ProtoWebSocket } from "../../../proto/ProtoWebSocket";
import { Server } from "../../connect/types";
import * as pb from "../../../proto/the_world";

type characterId = string;


type EETypes = [
    [`move_${characterId}`,     (pos: Vector2) => void],
]

type DEETypes = {
    "join"        : (user: Server.User, spawnPoint: Vector2) => void,
    "leave"       : (id: characterId) => void,
    "player_move" : (x: number, y: number) => void,
    // for chatting.
    "network_player_chat" : (id: characterId, msg: string) => void,
    "player_chat": (id: characterId, msg: string) => void,
}

export class PlayerNetworker {
    private readonly _ee: TypedEmitter<EETypes>;
    private readonly _dee: DumbTypedEmitter<DEETypes>;
    private readonly _characterSet: Set<characterId>;

    constructor(private readonly _playerId: string,
                private readonly _protoWs: ProtoWebSocket<pb.ServerEvent>) {
        this._ee = new TypedEmitter<EETypes>();
        this._dee = new DumbTypedEmitter<DEETypes>();
        this._characterSet = new Set();
        this._initNetwork();
        this._initEEListenters();
    }

    private _initNetwork() {
        this._protoWs.on("message", serverEvent => {
            if(serverEvent.event === "playerListChanged") {
                const playerInfos = serverEvent.playerListChanged.playerInfos;
                this.onPlayerListUpdate(playerInfos as any);
            } else if(serverEvent.event === "characterMoved") {
                const characterMove = serverEvent.characterMoved;
                const user = this._characterSet.has(characterMove.userId);
                user && this.moveCharacter(characterMove);
            }
        });
        // this._client.subscribe({
        //     query: gql`
        //         subscription PLAYER_LIST_UPDATE($worldId: String!) {
        //             playerList(worldId: $worldId) {
        //                 x
        //                 y
        //                 user {
        //                     id
        //                     nickname
        //                     skinSrc
        //                 }
        //             }
        //         }
        //     `,
        //     variables: {
        //         worldId: this._worldId,
        //     }
        // }).subscribe((data) => {
        //     data.data.playerList && this.onPlayerListUpdate(data.data.playerList);
        // });
    }


    private _initEEListenters() {
        // player_move should only listened on this method.
        this._dee.on("player_move", (x, y) => {
            this._protoWs.send(new pb.ClientEvent({
                moveCharacter: new pb.MoveCharacter({
                    characterMove: new pb.MoveCharacter.CharacterMove({
                        x,
                        y
                    })
                })
            }));
        });
    }


    private onPlayerListUpdate(data: {x: number, y: number, user: Server.User}[]) {
        const playerList = data;
        const playerIdSet = new Set(data.map(e => e.user.id));
        const newPlayers = playerList.filter(p => !this._characterSet.has(p.user.id));
        const leftPlayers = [...this._characterSet.keys()].filter(p => !playerIdSet.has(p));
        
        newPlayers.forEach(e => {
            if (this._playerId === e.user.id) return;
            this._dee.emit("join", e.user, new Vector2(e.x, e.y));
            this._characterSet.add(e.user.id);
        });
        leftPlayers.forEach(e => {
            this._dee.emit("leave", e);
            this._characterSet.delete(e);
        });
    }

    public showNetworkPlayerChat(userId: string, message: string): void {
        if (userId === this._playerId) {
            this._dee.emit("player_chat", userId, message);
        }
        else {
            this._dee.emit("network_player_chat", userId, message);
        }
    }

    private moveCharacter(data: {x: number, y: number, userId: string}) {
        this._ee.emit(`move_${data.userId}`, new Vector2(data.x, data.y));
    }

    get ee(): TypedEmitter<EETypes> {
        return this._ee;
    }

    get dee(): DumbTypedEmitter<DEETypes> {
        return this._dee;
    }
}

