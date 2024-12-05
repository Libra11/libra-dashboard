import { Permission } from "@/types/auth";

interface RoutePermission {
  path: string;
  permissions: Permission[];
  requireAll?: boolean;
}

export const routePermissions: RoutePermission[] = [
  {
    path: "/dashboard",
    permissions: ["dashboard.access"],
  },
  {
    path: "/dashboard/users",
    permissions: ["users.list"],
  },
  {
    path: "/dashboard/settings",
    permissions: ["settings.access"],
  },
];
