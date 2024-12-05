/*
 * @Author: Libra
 * @Date: 2024-12-03 14:33:09
 * @LastEditors: Libra
 * @Description:
 */
import { Home, Settings, Users, UserCircle, Shield } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: any;
  permission?: string;
}

export interface MenuGroup {
  items: MenuItem[];
}

export const menuConfig: Record<string, MenuGroup> = {
  // 基础菜单（不需要权限）
  base: {
    items: [
      {
        title: "nav.home",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "nav.profile",
        url: "/dashboard/profile",
        icon: UserCircle,
      },
    ],
  },
  // 需要权限的菜单
  management: {
    items: [
      {
        title: "nav.users.title",
        url: "/dashboard/users",
        icon: Users,
        permission: "users.list",
      },
      {
        title: "nav.roles",
        url: "/dashboard/roles",
        icon: Shield,
        permission: "roles.list",
      },
    ],
  },
  // 设置菜单
  settings: {
    items: [
      {
        title: "nav.settings",
        url: "/dashboard/settings",
        icon: Settings,
        permission: "settings.access",
      },
    ],
  },
};
