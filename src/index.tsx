import { ApolloClient, ApolloProvider,InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { UserProvider } from './hooks/useUser';

const client = new ApolloClient({
    uri: 'http://lunuy.com:3000/graphql',
    cache: new InMemoryCache(),  
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <UserProvider>
                <App />
            </UserProvider>
        </ApolloProvider>
    </React.StrictMode>
);
