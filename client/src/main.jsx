import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UIProvider } from "./contexts/UIContext";

// import "bootstrap/dist/css/bootstrap.min.css";
import "./bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </React.StrictMode>
);
