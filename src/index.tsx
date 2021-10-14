import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Provider from './context/Provider';
import { 
  ApolloProvider, 
  ApolloClient, 
  InMemoryCache,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { JWT_KEY } from './context/consts';

const httpLink = createHttpLink({
  uri: 'http://computa.lunuy.com:40080/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(JWT_KEY);
  
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

