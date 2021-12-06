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
interface MyClassEvents {
    'join': (user: User, spawnPoint: Point) => void,
    // [_: `move_${string}`]: (pos: Point) => void,
    // [_: `leave_${string}`]: () => void,
}

export class NetworkManager {
    private readonly _ee: TypedEmitter<MyClassEvents>;
    private readonly _characterMap: Set<characterId>;

    constructor(private readonly _worldId: string,
                private readonly _client: ApolloClient<any>) {
        this._ee = new TypedEmitter();
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
        // leftPlayers.forEach(e => {
        //     this._ee.emit(`leave_${e}`);
        // });
    }

    private moveCharacter(data: Point & {userId: string}) {
    //    this._ee.emit(`move_${data.userId}`, data);
    }

    get ee() {
        return this._ee;
    }
}

