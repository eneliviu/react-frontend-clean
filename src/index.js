import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import CurrentUserProvider from "./contexts/CurrentUserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <CurrentUserProvider>
                <App />
            </CurrentUserProvider>
        </Router>
    </React.StrictMode>
);
