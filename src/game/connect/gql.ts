import { useApolloClient, ApolloClient, gql } from "@apollo/client";
import { ServerWorld } from "./types";


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