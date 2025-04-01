import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.jsx";
import { removeSelection } from "./helpers.js";
document.body.addEventListener("click", removeSelection);
document.body.style.setProperty("--height", `${document.body.offsetHeight}px`);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
