import { ApolloClient, gql } from "@apollo/client";
import { TypedEmitter } from 'tiny-typed-emitter';
import { Vector2 } from "three";
import { User } from "../connect/types";

type characterId = string;


class EEWrapper {
    private ee = new TypedEmitter();

    emit(key: `join`,                   user: User, spawnPoint: Vector2): void;
    emit(key: `move_${characterId}`,    pos: Vector2)                   : void;
    emit(key: `leave_${characterId}`)                                   : void;
    emit(key: `player_move`,            x: number, y: number)           : void; 
    
    emit(key: string, ...args: any[]): void {
        this.ee.emit(key, ...args);
    }

    on(key: `join`,                 cb: (user: User, spawnPoint: Vector2) => void)  : void;
    on(key: `move_${characterId}`,  cb: (pos: Vector2) => void)                     : void;
    on(key: `leave_${characterId}`, cb: () => void)                                 : void;

    on(key: string, cb: (...args: any[]) => void): void {
        this.ee.on(key, cb);
    }


    once(key: `join`,                 cb: (user: User, spawnPoint: Vector2) => void)  : void;
    once(key: `move_${characterId}`,  cb: (pos: Vector2) => void)                     : void;
    once(key: `leave_${characterId}`, cb: () => void)                                 : void;

    once(key: string, cb: (...args: any[]) => void): void {
        this.ee.once(key, cb);
    }


    removeListener(key: `join`,                 cb: (user: User, spawnPoint: Vector2) => void)  : void;
    removeListener(key: `move_${characterId}`,  cb: (pos: Vector2) => void)                     : void;
    removeListener(key: `leave_${characterId}`, cb: () => void)                                 : void;

    removeListener(key: string, cb: (...args: any[]) => void): void {
        this.ee.removeListener(key, cb);
    }
}


export class NetworkManager {
    private readonly _ee: EEWrapper;
    private readonly _characterMap: Set<characterId>;

    constructor(private readonly _worldId: string,
                private readonly _playerId: string,
                private readonly _client: ApolloClient<any>) {
        this._ee = new EEWrapper();
        this._characterMap = new Set();
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
        })

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
                const user = this._characterMap.has(data.data?.characterMove?.userId);
                user && this.moveCharacter(data.data.characterMove);
            }
        });
    }


    private _initEEListenters() {
        // player_move should only listened on this method.
        // @ts-ignore
        this._ee.on("player_move", (x, y) => {
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
        })
    }


    private onPlayerListUpdate(data: {x: number, y: number, user: User}[]) {
        const playerList = data;
        const playerIdSet = new Set(data.map(e => e.user.id));
        const newPlayers = playerList.filter(p => !this._characterMap.has(p.user.id));
        const leftPlayers = [...this._characterMap.keys()].filter(p => !playerIdSet.has(p));
        
        newPlayers.forEach(e => {
            if (this._playerId === e.user.id) return;
            this._ee.emit("join", e.user, new Vector2(e.x, e.y));
            this._characterMap.add(e.user.id);
        });
        leftPlayers.forEach(e => {
            this._ee.emit(`leave_${e}`);
            this._characterMap.delete(e);
        });
    }

    private moveCharacter(data: {x: number, y: number, userId: string}) {
        this._ee.emit(`move_${data.userId}`, new Vector2(data.x, data.y));
    }

    get ee() {
        return this._ee;
    }
}

