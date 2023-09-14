import React from "react";
import { render } from "react-dom";

import App from "./App";
import "./i18n";

const container = document.getElementById("root") as HTMLElement;

render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <App />
    </React.Suspense>
  </React.StrictMode>,
  container
);
