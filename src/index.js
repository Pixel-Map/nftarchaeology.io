import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const mount = document.getElementById("root");
// Query-dependent views differ from the shared, prerendered route snapshot.
if (window.location.search) mount.textContent = "";
const render = mount.hasChildNodes() ? ReactDOM.hydrate : ReactDOM.render;
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  mount,
);
