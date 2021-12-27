import { ApolloClient, gql } from "@apollo/client";
import { TypedEmitter, DumbTypedEmitter } from "detail-typed-emitter";
import { Vector2 } from "three";
import { Server } from "../../connect/types";

type characterId = string;


type EETypes = [
    [`move_${characterId}`,     (pos: Vector2) => void],
]

type DEETypes = {
    "join"        : (user: Server.User, spawnPoint: Vector2) => void,
    "leave"       : (id: characterId) => void,
    "player_move" : (x: number, y: number) => void
}

export class PlayerNetworker {
    private readonly _ee: TypedEmitter<EETypes>;
    private readonly _dee: DumbTypedEmitter<DEETypes>;
    private readonly _characterSet: Set<characterId>;

    constructor(private readonly _worldId: string,
                private readonly _playerId: string,
                private readonly _client: ApolloClient<any>) {
        this._ee = new TypedEmitter<EETypes>();
        this._dee = new DumbTypedEmitter<DEETypes>();
        this._characterSet = new Set();
        this._initNetwork();
        this._initEEListenters();
    }

    private _initNetwork() {
        this._client.subscribe({
            query: gql`
                subscription PLAYER_LIST_UPDATE($worldId: String!) {
                    playerList(worldId: $worldId) {
                        x
                        y
                        user {
                            id
                            nickname
                            skinSrc
                        }
                    }
                }
            `,
            variables: {
                worldId: this._worldId,
            }
        }).subscribe((data) => {
            data.data.playerList && this.onPlayerListUpdate(data.data.playerList);
        });

        this._client.subscribe({
            query: gql`
                subscription CHARACTER_MOVE($worldId: String!) {
                    characterMove(worldId: $worldId) {
                        x
                        y
                        userId
                    }
                }
            `,
            variables: {
                worldId: this._worldId
            },
        }).subscribe((data) => {
            if (data.data.characterMove) {
                const user = this._characterSet.has(data.data?.characterMove?.userId);
                user && this.moveCharacter(data.data.characterMove);
            }
        });
    }


    private _initEEListenters() {
        // player_move should only listened on this method.
        this._dee.on("player_move", (x, y) => {
            this._client.mutate({
                mutation: gql`
                    mutation MoveCharacter($characterMove: CharacterMoveInput!, $worldId: String!) {
                        moveCharacter(characterMove: $characterMove, worldId: $worldId) {
                            x
                            y
                        }
                    }
                `,
                variables: {
                    characterMove: {
                        x,
                        y,
                    },
                    worldId: this._worldId,
                }
            });
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

