import { Outlet } from "react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppHeader } from "./components/Header";
import { AppSidebar } from "./components/Sidebar";

export function ProtectedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 px-page-x py-page-y">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
