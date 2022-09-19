import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "./context/Provider";
import {
    ApolloProvider,
    ApolloClient,
    InMemoryCache,
    createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { JWT_KEY } from "./context/consts";
import { loadGlobalEnviroments } from "./GlobalEnviroment";

const httpLink = createHttpLink({
    uri: "https://api.the-world.space/graphql"
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

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

loadGlobalEnviroments();

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Provider>
                <App />
            </Provider>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
