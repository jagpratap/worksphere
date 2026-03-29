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
import { paths } from "@/config/paths";
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
              <Link to={paths.home.path}>
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

function NavGroupSection({ group }: { group: NavGroup }) {
  const { can } = usePermission();
  const location = useLocation();

  const permittedItems = group.items.filter(item => can(item.permission));

  if (permittedItems.length === 0)
    return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {permittedItems.map((item) => {
            const hasNestedSibling = permittedItems.some(
              other => other.path !== item.path && other.path.startsWith(`${item.path}/`),
            );

            const isActive
              = location.pathname === item.path
                || (item.path !== "/" && !hasNestedSibling && location.pathname.startsWith(`${item.path}/`));

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
