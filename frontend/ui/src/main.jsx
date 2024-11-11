import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserSessionProvider } from "./components/UserSession.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserSessionProvider>
      <App />
    </UserSessionProvider>
  </React.StrictMode>
);
