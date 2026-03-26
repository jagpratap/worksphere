import { Provider } from "react-redux";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { store } from "@/store";

import { Router } from "./Router";

export function App() {
  return (
    <Provider store={store}>
      <Toaster richColors position="top-right" closeButton />
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </Provider>
  );
}
