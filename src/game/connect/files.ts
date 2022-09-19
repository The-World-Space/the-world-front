import {
    ApolloClient,
    InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { JWT_KEY } from "../../context/consts";
import { createUploadLink } from "apollo-upload-client";

const uploadLink = createUploadLink({
    uri: "https://asset-api.the-world.space/graphql",
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(JWT_KEY);

    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : "",
        }
    };
});

export const globalFileApolloClient = new ApolloClient({
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache(),
});
