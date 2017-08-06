import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import '../frontend/assets/styledComponents/globalStyle';

const rootEl = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <Routes />, rootEl,
  );
};

render();
