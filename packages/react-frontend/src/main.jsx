import React from "react";
import ReactDOMClient from "react-dom/client";
import "./main.css";
import MyApp from "./MyApp";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(<MyApp />);


