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
    private _renderer: Renderer;
    private _client!: ApolloClient<any>;

    public afterMove: (controler: NetworkController) => void = _ => { };

    constructor(renderer: Renderer, world: World, character: Human) {
        this._world = world;
        this._characterMap = new Map();
        this._renderer = renderer;

        this._bindEvent();
        this._initApolloClient();
    }

    private _initApolloClient() {
        this._client = new ApolloClient({
            link,
            cache: new InMemoryCache()
        });

        this._client.subscribe({
            query: gql`
            
            `,
            variables: {},
        }).subscribe((data) => {
            
        });

        
    }

    private _bindEvent() {
        // this._eventTarget.addEventListener('keydown', this._onKeyDown.bind(this));
        // this._eventTarget.addEventListener('keyup', this._onKeyUp.bind(this));


    }


    private moveCharacter(nextPos: Point, user: UserData) {
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
        this._characterMap.set(user.user.id, user);
        this._world.addCharacter(user.character);
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