import { ServerWorld } from "./types";
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



export async function getWorld(id: string, apolloClient: ApolloClient<any>) {
    const result = await apolloClient.query({
        query: gql`
            query World($id: String!) {
                World(id: $id) {
                    id
                    name
                    tiles {
                        x
                        y
                        movableRight
                        movableBottom
                    }
                    iframes {
                        id
                        x
                        y
                        width
                        height
                        type
                        src
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
                    }
                    images {
                        id
                        x
                        y
                        width
                        height
                        type
                        src
                    }
                }
            }
        `,
        variables: {
            id,
        }
    });

    return result.data.World as ServerWorld;
}


export async function getMyWorlds(apolloClient: ApolloClient<any>) {
    const result = await apolloClient.query({
        query: gql`
            query MyWorlds {
                myWorlds {
                    id
                    name
                    tiles {
                        x
                        y
                        movableRight
                        movableBottom
                    }
                    iframes {
                        id
                        x
                        y
                        width
                        height
                        type
                        src
                    }
                    images {
                        id
                        x
                        y
                        width
                        height
                        type
                        src
                    }
                }
            }
        `
    });

    return result.data.myWorlds as ServerWorld[];
}



export function getSession() {
    return {
        token: localStorage.getItem(JWT_KEY),
    }
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

export const link = new WebSocketLink({
    url: 'wss://computa.lunuy.com:40081/graphql',
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


export const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache()
});