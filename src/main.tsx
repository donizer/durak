import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Context from "./contexts/Context.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Context>
      {/* <Game /> */}
      <App />
    </Context>
  </React.StrictMode>
);
