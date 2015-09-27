process.on("unhandledRejection", (rej) => {
  console.error("Detected unhandled rejected promise:");
  console.error(rej);
});

import React from "react";
import ReactDOM from "react-dom";

import { compose, createStore, applyMiddleware } from "redux";
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from "react-redux";
import reduceReducers from "reduce-reducers";

import { playlistReducer, playbackStateReducer } from "./redux/reducers";

import Application from "./components/application";


const rootReducer = reduceReducers(
  playlistReducer,
  playbackStateReducer
);

const finalCreateStore = compose(
  devTools()
)(createStore);

const store = finalCreateStore(rootReducer);

const app = (
  <div>
    <Provider store={store}>
      <Application />
    </Provider>
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false} />
    </DebugPanel>
  </div>
);

ReactDOM.render(app, document.getElementById("app"));
