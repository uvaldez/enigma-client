import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

// const graphQLServer = 'https://enigma-api.herokuapp.com/graphql';
const graphQLServer = 'http://localhost:8000/graphql';

const networkInterface = createNetworkInterface({ uri: graphQLServer });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}; // Create the header object if needed.
    }
    req.options.headers.authorization = localStorage.getItem('token', '');
    next();
  },
}]);

export const client = new ApolloClient({
  networkInterface,
});


export const rootReducer = combineReducers({
  routing: routerReducer,
  apollo: client.reducer(),
});
