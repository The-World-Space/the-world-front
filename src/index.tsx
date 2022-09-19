import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    InMemoryCache} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { JWT_KEY } from "./context/consts";
import { Provider } from "./context/Provider";
import { loadGlobalEnviroments } from "./GlobalEnviroment";

const httpLink = createHttpLink({
    uri: "https://api.the-world.space/graphql"
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(JWT_KEY);

    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : ""
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
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
