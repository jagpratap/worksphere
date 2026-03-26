import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";
import "./index.css";
import { ENV } from "./config/env";

async function bootstrap() {
  if (ENV.ENABLE_MSW) {
    const { startMSW } = await import("./mocks");
    await startMSW();
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
