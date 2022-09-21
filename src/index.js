import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import store from './redux/store';
import { Provider } from 'react-redux';

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
      <Provider store={store}>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"/>
        <App/>
      </Provider>
);
