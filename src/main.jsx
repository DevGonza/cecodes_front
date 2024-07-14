import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import LogoCecodes from "./assets/Logo_CECODES.png"
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="logo-container" > 
      <img src={LogoCecodes} alt="Logo Cecodes" width="300px" />
    </div>
    <App />
  </React.StrictMode>
);
