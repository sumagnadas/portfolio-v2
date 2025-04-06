import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.jsx";
import { removeSelection } from "./helpers.js";
document.body.addEventListener("click", removeSelection);
document.body.style.setProperty("--height", `${document.body.offsetHeight}px`);
document.body.style.setProperty("--width", `${document.body.offsetWidth}px`);
window.addEventListener("resize", () => {
  document.body.style.setProperty(
    "--height",
    `${document.body.offsetHeight}px`
  );
  document.body.style.setProperty("--width", `${document.body.offsetWidth}px`);
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
