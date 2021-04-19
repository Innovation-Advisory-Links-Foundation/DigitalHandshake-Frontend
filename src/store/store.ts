import { compose, createStore } from "redux";
import reducers from "../reducers";

const initialState = {};
const enhancers = [];

// Enables the DevTools extension for debugging Redux in the browser.
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

if (typeof devToolsExtension === "function") {
  enhancers.push(devToolsExtension());
}

// Redux store instance.
const store: any = createStore(
  reducers, // Combined reducers.
  initialState,
  compose(...enhancers) // Extends the functionality of the store (e.g., enabling the devtools extension).
);

export default store;
