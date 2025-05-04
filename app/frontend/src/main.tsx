/// <reference types="vite/client" />

import "reflect-metadata";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.scss";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>,
);
