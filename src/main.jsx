import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Crontab from "./Crontab.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Crontab onChange={(data) => console.log(data)} />
  </React.StrictMode>
);
