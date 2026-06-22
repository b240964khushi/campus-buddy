import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";
import { initApiClient } from "./lib/api-client";

const apiBase = import.meta.env.VITE_API_BASE_URL;
if (apiBase) {
  setBaseUrl(apiBase);
}

initApiClient();

createRoot(document.getElementById("root")!).render(<App />);
