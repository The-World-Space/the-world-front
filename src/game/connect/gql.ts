import { Server } from "./types";
import {
    ApolloLink,
    Operation,
    FetchResult,
    Observable,
} from "@apollo/client/core";
import {
    ApolloClient,
    InMemoryCache,
    gql,
    NormalizedCacheObject
} from "@apollo/client";
import { print } from "graphql";
import { createClient, ClientOptions, Client } from "graphql-ws";
import { JWT_KEY } from "../../context/consts";
import { Vector2 } from "three";



export async function getWorld(id: string, apolloClient: ApolloClient<any>): Promise<Server.World> {
    const result = await apolloClient.query({
        query: gql`
        query World($id: String!) {
            World(id: $id) {
                id
                name
                amIAdmin
                amIOwner
                colliders {
                    x
                    y
                    isBlocked
                }
                iframes {
                    id
                    x
                    y
                    fieldPortMappings {
                        id
                        portId
                        field {
                            value
                            id
                        }
                    }
                    broadcasterPortMappings {
                        id
                        portId
                        broadcaster {
                            id
                        }
                    }
                    localFields {
                        id
                        name
                        value
                    }
                    localBroadcasters {
                        id
                        name
                    }
                    proto_ {
                        id
                        isPublic
                        width
                        height
                        type
                        src
                        colliders {
                            x
                            y
                            isBlocked
                        }
                        owner {
                            id
                        }
                    }
                }
                images {
                    id
                    x
                    y
                    proto_ {
                        id
                        isPublic
                        width
                        height
                        type
                        src
                        colliders {
                            x
                            y
                            isBlocked
                        }
                    }
                }
                atlasInfoScalar
                admins {
                    id
                    nickname
                }
            }
        }
        `,
        variables: {
            id,
        }
    });

    return result.data.World as Server.World;
}


export async function getMyWorlds(apolloClient: ApolloClient<any>): Promise<Server.World[]> {
    const result = await apolloClient.query({
        query: gql`
            query MyWorlds {
                myWorlds {
                    id
                    name
                }
            }
        `,
        fetchPolicy: "no-cache"
    });

    return result.data.myWorlds as Server.World[];
}



export async function joinWorld(
    worldId: string, 
    pos: Vector2, 
    apolloClient: ApolloClient<any>
): Promise<FetchResult<any, Record<string, any>, Record<string, any>>> {
    return apolloClient.mutate({
        mutation: gql`
            mutation JOIN_WORLD($x: Int!, $y: Int!, $worldId: String!) {
                joinWorld(x: $x, y: $y, id: $worldId)
            }
        `,
        variables: {
            x: pos.x,
            y: pos.y,
            worldId,
        }
    });
}


export function getSession(): { token: string|null } {
    return {
        token: localStorage.getItem(JWT_KEY),
    };
}


export class WebSocketLink extends ApolloLink {
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
                                    `Socket closed with event ${err.code} ${err.reason || ""
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




export function getWSLink(): ApolloLink {
    const link = new WebSocketLink({
        url: "wss://api.the-world.space/graphql",
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

    return link;
}

export function getWSApolloClient(link: ApolloLink): ApolloClient<NormalizedCacheObject> {
    const client = new ApolloClient({
        link,
        cache: new InMemoryCache()
    });

    return client;
}