import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import { router } from "./router";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

async function initEruda() {
  if (process.env.NODE_ENV !== "development") return;

  const eruda = (await import("eruda")).default;
  eruda.init();
}

initEruda();

ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
