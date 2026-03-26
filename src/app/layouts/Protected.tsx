import { Outlet } from "react-router";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function ProtectedLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <span className="text-lg font-semibold">WorkSphere</span>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <p className="text-sm text-muted-foreground">Navigation goes here</p>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-sm text-muted-foreground">User menu goes here</p>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppHeader() {
  return (
    <header className="flex h-14 items-center gap-3 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <span className="text-sm text-muted-foreground">WorkSphere</span>
    </header>
  );
}
