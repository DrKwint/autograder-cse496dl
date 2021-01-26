import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import App from 'App';
import leaderboard from 'reducers';

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss";

const store = createStore(
    leaderboard,
    applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
