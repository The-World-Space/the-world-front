import { Character } from "../../core/Character/Character";
import { Physics } from "../../core/Physics/Physics";
import { Renderer } from "../../core/Renderer/Renderer";
import { Direction, Point } from "../../core/types/Base";
import { Human } from "../character/Human";
import {
    ApolloLink,
    Operation,
    FetchResult,
    Observable,
} from "@apollo/client/core";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    gql
} from "@apollo/client";
import { print } from "graphql";
import { createClient, ClientOptions, Client } from "graphql-ws";
import { JWT_KEY } from "../../context/consts";
import { World } from "../../core/World/World";
import { ImageShape } from "../../core/types/Shape/ImageShape";



interface User {
    id: string;
    nickname: string;
}

interface UserData {
    user: User;
    character: Human; 
    currentMoving: Direction | null;
    currentMovingTimeout: ReturnType<typeof setTimeout> | null;
}



function hyeonJongFactory() {
    const character = new Human(
        new ImageShape({
            width: 1,
            height: 2,
        }, 'https://e7.pngegg.com/pngimages/517/871/png-clipart-8-bit-super-mario-illustration-super-mario-bros-new-super-mario-bros-video-game-sprite-angle-super-mario-bros.png'),
        {
            walking: ['top.gif', 'bottom.gif', 'left.gif', 'right.gif'].map(e => `/assets/hyeonjong/${e}`) as [string, string, string, string],
            standing: ['tile008.png', 'tile000.png', 'tile012.png', 'tile004.png'].map(e => `/assets/hyeonjong/${e}`) as [string, string, string, string],
        }
    );
    return character;
}



class WebSocketLink extends ApolloLink {
    private client: Client;

    constructor(options: ClientOptions) {
        super();
        this.client = createClient(options);
    }

    public request(operation: Operation): Observable<FetchResult> {
        return new Observable((sink) => {
            return this.client.subscribe<FetchResult>(
                { ...operation, query: print(operation.query) },
                {
                    next: sink.next.bind(sink),
                    complete: sink.complete.bind(sink),
                    error: (err) => {
                        if (Array.isArray(err))
                            // GraphQLError[]
                            return sink.error(
                                new Error(
                                    err.map(({ message }) => message).join(", ")
                                )
                            );

                        if (err instanceof CloseEvent)
                            return sink.error(
                                new Error(
                                    `Socket closed with event ${err.code} ${
                                        err.reason || ""
                                    }` // reason will be available on clean closes only
                                )
                            );

                        return sink.error(err);
                    },
                }
            );
        });
    }
}


function getSession() {
    return {
        token: localStorage.getItem(JWT_KEY),
    }
}


const link = new WebSocketLink({
    url: "ws://computa.lunuy.com:40080/graphql",
    connectionParams: () => {
        const session = getSession();
        if (!session) {
            return {};
        }
        return {
            Authorization: `${session.token}`,
        };
    },
});


export class NetworkController {
    private _characterMap: Map<string, UserData>;
    private _world: World;
    private _worldId: string;
    private _playerId: string;
    private _renderer: Renderer;
    private _client!: ApolloClient<any>;

    public afterMove: (controler: NetworkController) => void = _ => { };

    constructor(renderer: Renderer, world: World, character: Human, worldId: string, playerId: string) {
        this._world = world;
        this._worldId = worldId;
        this._characterMap = new Map();
        this._playerId = playerId;
        this._renderer = renderer;

        this._initApolloClient();
    }

    private _initApolloClient() {
        this._client = new ApolloClient({
            link,
            cache: new InMemoryCache()
        });

        this._client.subscribe({
            query: gql`
                subscription PLAYER_LIST_UPDATE($worldId: String!) {
                    playerList(worldId: $worldId) {
                        id
                        nickname
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
            console.debug('character move', data.data);
            if (data.data.characterMove) {
                const user = this._characterMap.get(data.data?.characterMove?.userId);
                user && this.moveCharacter(data.data.characterMove, user);
            }
        });

        
    }

    private onPlayerListUpdate(data: User[]) {
        const playerList = data;
            const newPlayers = playerList.filter(p => !this._characterMap.has(p.id));
            const leftPlayers = [...this._characterMap.keys()].filter(p => !playerList.find(p2 => p2.id === p));

            newPlayers.forEach(p => {
                const user = {
                    user: p,
                    character: hyeonJongFactory(),
                    currentMoving: null,
                    currentMovingTimeout: null
                };
                this.joinUser(user);
            });

            leftPlayers.forEach(p => {
                const user = this._characterMap.get(p);

                user && this.leaveUser(user);
            });

    }


    private moveCharacter(nextPos: Point, user: UserData) {
        if (this._playerId === user.user.id) return;

        const move = (nextPos: Point, user: UserData) => {
            user.character.setPosition(nextPos);
            user.currentMoving = Direction.down;
            this._renderer.updateOne(user.character);

            this.afterMove(this);

            user.currentMovingTimeout = setTimeout(() => {
                user.currentMoving = null;
                if (user.currentMovingTimeout !== null) clearTimeout(user.currentMovingTimeout);
                user.character.stop();
                setTimeout(() => this._renderer.updateOne(user.character), 0);
            }, 100);
        };


        const beforePos = user.character.getPosition();
        const going = this._going(beforePos, nextPos);

        console.log('going', going);

        if (going) {
            user.character.walk(going);
            if (user.currentMoving) {
                if (user.currentMoving !== going) {
                    user.currentMoving = going;
                }
            } else {
                move(nextPos, user);
            }
        }
    }


    private joinUser(user: UserData) {
        if (this._playerId === user.user.id) return;

        this._characterMap.set(user.user.id, user);
        this._world.addCharacter(user.character);
        this._renderer.drawUnflatObject(user.character);
        console.debug('joinUser', user);
    }

    private leaveUser(user: UserData) {
        this._characterMap.delete(user.user.id);
        this._world.removeCharacter(user.character);
    }

    // private _onKeyUp(event: KeyboardEvent) {
    //     const going = this._going(event);

    //     if (this._currentMoving && going) {
    //         if (going === this._currentMoving) {
    //             this._currentMoving = null;
    //             if (this._currentMovingTimeout !== null) clearTimeout(this._currentMovingTimeout);
    //             // this._characterMap.stop()
    //             // setTimeout(() => this._renderer.updateOne(this._characterMap), 0);
    //         }
    //     }
    // }

    private _going(beforePoint: Point, afterPoint: Point) {
        const dx = afterPoint.x - beforePoint.x;
        const dy = afterPoint.y - beforePoint.y;
        
        let going = null;

        if      (dx < 0) going = Direction.left;
        else if (dx > 0) going = Direction.right;
        else if (dy < 0) going = Direction.up;
        else if (dy > 0) going = Direction.down;

        return going;
    }


}