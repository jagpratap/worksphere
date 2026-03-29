import { ChevronsUpDown, LogOut, User } from "lucide-react";
import { Link } from "react-router";

import type { SafeUser } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { paths } from "@/config/paths";
import { ROLE_LABELS } from "@/constants";
import { selectCurrentUser, useSignOutMutation } from "@/features/auth";
import { useAppSelector } from "@/store";
import { getInitials } from "@/utils/string";

export function NavUser() {
  const user = useAppSelector(selectCurrentUser);
  const { isMobile } = useSidebar();
  const [signOut, { isLoading }] = useSignOutMutation();

  if (!user)
    return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserInfo user={user} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserInfo user={user} />
                <Badge variant="outline" className="ml-auto text-[10px]">
                  {ROLE_LABELS[user.role]}
                </Badge>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to={paths.shared.profile.path}>
                <User />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => signOut()}
              disabled={isLoading}
            >
              <LogOut />
              {isLoading ? "Signing out…" : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserInfo({ user }: { user: SafeUser }) {
  return (
    <>
      <Avatar className="size-8 rounded-lg">
        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
        <AvatarFallback className="rounded-lg text-xs">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-xs text-sidebar-foreground/60">
          {user.email}
        </span>
      </div>
    </>
  );
}
