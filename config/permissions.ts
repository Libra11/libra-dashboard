/*
 * @Author: Libra
 * @Date: 2024-12-03 10:42:36
 * @LastEditors: Libra
 * @Description:
 */
import { Permission, Role, UserRole } from "@/types/auth";

export const ROLES: Record<Role, UserRole> = {
  admin: {
    id: "admin",
    name: "admin",
    permissions: [
      "dashboard.access",
      "users.list",
      "users.create",
      "users.edit",
      "users.delete",
      "settings.access",
      "settings.edit",
    ],
  },
  user: {
    id: "user",
    name: "user",
    permissions: ["dashboard.access", "settings.access"],
  },
  guest: {
    id: "guest",
    name: "guest",
    permissions: [],
  },
};
