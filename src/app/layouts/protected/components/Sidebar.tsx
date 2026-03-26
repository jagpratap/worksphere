import { Link, useLocation } from "react-router";

import type { NavGroup } from "@/config/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NAV_GROUPS } from "@/config/navigation";
import { usePermission } from "@/hooks/use-permission";

import { DevRoleSwitcher } from "./DevRoleSwitcher";
import { NavUser } from "./NavUser";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="text-sm font-bold">W</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">WorkSphere</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    Project Management
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map(group => (
          <NavGroupSection key={group.label} group={group} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <DevRoleSwitcher />
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

// ─── NavGroupSection ────────────────────────────────────────────────────────
// Renders a group only if the user has permission for at least one item.

function NavGroupSection({ group }: { group: NavGroup }) {
  const { can } = usePermission();
  const location = useLocation();

  // Filter items to only those the user can access
  const visibleItems = group.items.filter(item => can(item.permission));

  // Hide the entire group if no items are visible
  if (visibleItems.length === 0)
    return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => {
            const isActive
              = location.pathname === item.path
                || (item.path !== "/" && location.pathname.startsWith(`${item.path}/`));

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link to={item.path}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
