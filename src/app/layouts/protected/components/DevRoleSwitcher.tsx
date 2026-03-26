import { ArrowRightLeft } from "lucide-react";

import type { Role } from "@/constants";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ENV } from "@/config/env";
import { ROLE_LABELS, ROLES } from "@/constants";
import { selectCurrentUser, setUserRole } from "@/features/auth";
import { useAppDispatch, useAppSelector } from "@/store";

/**
 * Dev-only role switcher for the sidebar footer.
 * Hot-swaps the user's role in Redux without signing out.
 * Hidden in production builds.
 */
export function DevRoleSwitcher() {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const { isMobile } = useSidebar();

  // Only show in development
  if (!ENV.isDev || !user)
    return null;

  function handleRoleSwitch(newRole: Role) {
    dispatch(setUserRole(newRole));
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="sm"
              className="border border-dashed border-sidebar-border text-xs text-sidebar-foreground/70"
            >
              <ArrowRightLeft className="size-4" />
              <span>
                Dev:
                {ROLE_LABELS[user.role]}
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs">
              Switch Role
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(ROLES).map(role => (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleSwitch(role)}
                disabled={user.role === role}
              >
                {ROLE_LABELS[role]}
                {user.role === role && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    current
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
