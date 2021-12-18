import { ApolloClient, gql } from "@apollo/client";
import { ArgumentNode } from "graphql";
import { Point } from "../../core/types/Base";
import { GameObject } from "../../core/types/GameObject";
import { TypedEmitter } from 'tiny-typed-emitter';

interface User {
    id: string;
    nickname: string;
}


type characterId = string;


class EEWrapper {
    private ee = new TypedEmitter();

    emit(key: `join`,                   user: User, spawnPoint: Point)  : void;
    emit(key: `move_${characterId}`,    pos: Point)                     : void;
    emit(key: `leave_${characterId}`)                                   : void;
    
    emit(key: string, ...args: any[]): void {
        this.ee.emit(key, ...args);
    }

    on(key: `join`,                 cb: (user: User, spawnPoint: Point) => void): void;
    on(key: `move_${characterId}`,  cb: (pos: Point) => void)                   : void;
    on(key: `leave_${characterId}`, cb: () => void)                             : void;

    on(key: string, cb: (...args: any[]) => void): void {
        this.ee.on(key, cb);
    }
}


export class NetworkManager {
    private readonly _ee: EEWrapper;
    private readonly _characterMap: Set<characterId>;

    constructor(private readonly _worldId: string,
                private readonly _client: ApolloClient<any>) {
        this._ee = new EEWrapper();
        this._characterMap = new Set();
        this._initNetwork();
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

    private onPlayerListUpdate(data: {x: number, y: number, user: User}[]) {
        const playerList = data;
        const playerIdSet = new Set(data.map(e => e.user.id));
        const newPlayers = playerList.filter(p => !this._characterMap.has(p.user.id));
        const leftPlayers = [...this._characterMap.keys()].filter(p => !playerIdSet.has(p));
        
        newPlayers.forEach(e => {
            this._ee.emit("join", e.user, e);
        });
        leftPlayers.forEach(e => {
            this._ee.emit(`leave_${e}`);
        });
    }

    private moveCharacter(data: Point & {userId: string}) {
        this._ee.emit(`move_${data.userId}`, data);
    }

    get ee() {
        return this._ee;
    }
}

