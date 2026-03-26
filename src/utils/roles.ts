import type { Role } from "@/constants";

import { ROUTE_ROLE_MAP } from "@/config/roles";

export function getAllowedRolesForPath(pathname: string): Role[] | null {
  const prefixes = Object.keys(ROUTE_ROLE_MAP).sort(
    (a, b) => b.length - a.length,
  );

  for (const prefix of prefixes) {
    if (pathname.startsWith(prefix)) {
      return ROUTE_ROLE_MAP[prefix];
    }
  }

  return null;
}
