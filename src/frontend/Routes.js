import React from 'react';
import { IndexRoute, Route, Router } from 'react-router';
import { ApolloProvider } from 'react-apollo';

import App from './component/App';
import Home from './component/Home';

import { store, history } from './store';
import { client } from './redurcers/index';

function route() {
  return (
    <ApolloProvider store={store} client={client}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
        </Route>
      </Router>
    </ApolloProvider>
  );
}

export default route;

