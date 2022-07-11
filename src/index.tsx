import { ApolloClient, ApolloProvider,InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { API_URL } from './constants/apolloClient';
import { UserProvider } from './hooks/useUser';

import { ThemeProvider } from 'styled-components';
import { DARK_THEME, LIGHT_THEME } from './constants/css';

const client = new ApolloClient({
    uri: API_URL,
    cache: new InMemoryCache(),  
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <UserProvider>
                <ThemeProvider theme={DARK_THEME || LIGHT_THEME}>
                    <App />
                </ThemeProvider>
            </UserProvider>
        </ApolloProvider>
    </React.StrictMode>
);
