/**
 * Author: Libra
 * Date: 2024-11-29 17:10:34
 * LastEditors: Libra
 * Description:
 */
"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useLocaleStore } from "@/store/locale";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserMenus } from "@/api/menus";
import { Menu } from "@prisma/client";
import React from "react";
import Icon from "@/app/components/icons";
import * as Icons from "lucide-react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/public/logo.svg";
import { SettingsDialog } from "@/app/components/settings-dialog";
import { LogOut } from "lucide-react";
import { LogoutDialog } from "@/app/components/logout-dialog";

interface MenuTreeItem extends Menu {
  children: MenuTreeItem[];
}

export function AppSidebar() {
  const t = useTranslations();
  const { locale } = useLocaleStore();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // 获取菜单数据
  useEffect(() => {
    const fetchMenus = async () => {
      if (session?.user?.id) {
        try {
          const menus = await getUserMenus();
          setMenuItems(menus);
        } catch (error) {
          console.error("Error fetching menus:", error);
          setMenuItems([]);
        }
      }
    };

    fetchMenus();
  }, [session]);

  // 构建菜单树
  const createTreeMenu = (items: Menu[]): MenuTreeItem[] => {
    const menuMap = new Map<string, MenuTreeItem>();
    const tree: MenuTreeItem[] = [];

    items.forEach((item) => {
      menuMap.set(item.id, { ...item, children: [] });
    });

    items.forEach((item) => {
      const node = menuMap.get(item.id)!;
      if (item.parentId) {
        const parent = menuMap.get(item.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });
    return tree;
  };

  const getLocalizedUrl = (url: string) => {
    return locale === "zh" ? url : `/${locale}${url}`;
  };

  const renderMenuItem = (item: MenuTreeItem) => {
    const hasChildren = item.children.length > 0;
    const isActive = pathname === getLocalizedUrl(item.path);
    const isOpen = openMenus[item.id];

    if (hasChildren) {
      return (
        <div key={item.id} className="space-y-1">
          <div
            onClick={() =>
              setOpenMenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
            }
            className={cn(
              "my-1 flex items-center px-2 h-12 py-2 text-sm cursor-pointer rounded-2xl hover:bg-[hsl(var(--accent))]",
              collapsed && "justify-center px-0 w-12"
            )}
          >
            {item.icon && (
              <div className="h-9 w-9 bg-[hsl(var(--bg-icon))] rounded-xl flex justify-center items-center shrink-0">
                <Icon
                  name={item.icon as keyof typeof Icons}
                  className="h-4 w-4 text-[hsl(var(--primary))]"
                />
              </div>
            )}
            <span
              className={cn(
                "ml-2 transition-all duration-300",
                collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100"
              )}
            >
              {t(item.name)}
            </span>
            {!collapsed && (
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </div>
          {!collapsed && (
            <div
              className={cn(
                "overflow-hidden transition-all duration-200 ease-in-out",
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="ml-4 space-y-1 pt-1">
                {item.children
                  .sort((a, b) => a.sort - b.sort)
                  .map((child) => (
                    <Link
                      key={child.id}
                      href={getLocalizedUrl(child.path)}
                      className={cn(
                        "my-1 flex items-center px-2 h-12 py-2 text-sm rounded-2xl transition-colors",
                        pathname.startsWith(getLocalizedUrl(child.path))
                          ? "bg-[hsl(var(--primary))] text-white"
                          : "hover:bg-[hsl(var(--accent))]"
                      )}
                    >
                      {child.icon && (
                        <div className="h-9 w-9 bg-[hsl(var(--bg-icon))] rounded-xl flex justify-center items-center shrink-0">
                          <Icon
                            name={child.icon as keyof typeof Icons}
                            className="h-4 w-4 text-[hsl(var(--primary))]"
                          />
                        </div>
                      )}
                      <span
                        className={cn(
                          "ml-2 transition-all duration-300",
                          collapsed
                            ? "w-0 opacity-0 ml-0"
                            : "w-auto opacity-100"
                        )}
                      >
                        {t(child.name)}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // 修改菜单项的样式类
    const menuItemStyles = cn(
      "flex items-center h-12 py-2 text-sm cursor-pointer rounded-2xl transition-all duration-300 ease-in-out",
      collapsed ? "w-12 px-0 justify-center" : "w-full px-2"
    );

    // 修改文本的样式类
    const textStyles = cn(
      "transform transition-all duration-300 ease-in-out overflow-hidden",
      collapsed ? "w-0 opacity-0 translate-x-2" : "w-auto opacity-100 ml-2"
    );

    return (
      <Link
        key={item.id}
        href={getLocalizedUrl(item.path)}
        className={cn(
          menuItemStyles,
          isActive
            ? "bg-[hsl(var(--primary))] text-white"
            : "hover:bg-[hsl(var(--accent))]"
        )}
      >
        {item.icon && (
          <div className="h-9 w-9 bg-[hsl(var(--bg-icon))] rounded-xl flex justify-center items-center shrink-0">
            <Icon
              name={item.icon as keyof typeof Icons}
              className="h-4 w-4 text-[hsl(var(--primary))]"
            />
          </div>
        )}
        <span className={textStyles}>{t(item.name)}</span>
      </Link>
    );
  };

  const menuTree = createTreeMenu(menuItems);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className={cn(
          "absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background",
          "flex items-center justify-center hover:bg-accent",
          "transition-transform duration-300",
          collapsed && "rotate-180"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex-shrink-0 px-3 py-4">
        <div
          className={cn(
            "flex items-center gap-3 px-3",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="h-12 w-12 rounded-xl bg-[hsl(var(--bg-icon))] flex items-center justify-center shrink-0">
            <Logo
              className="w-8 h-8 text-[hsl(var(--primary))]"
              viewBox="0 0 127.5 101"
              preserveAspectRatio="xMidYMid meet"
            />
          </div>
          <div
            className={cn(
              "flex flex-col transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            <span className="text-lg font-semibold whitespace-nowrap">
              Libra
            </span>
            <span className="text-sm text-[hsl(var(--muted-foreground))] whitespace-nowrap">
              {t("nav.dashboard")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-3">
        <nav className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-accent scrollbar-track-transparent">
          <div className="space-y-3 py-2 pr-2">
            {menuTree
              .sort((a, b) => a.sort - b.sort)
              .map((item) => renderMenuItem(item))}
          </div>
        </nav>
      </div>

      <div className="flex-shrink-0 border-t p-4 space-y-2">
        <div
          className={cn(
            "flex items-center transition-all duration-300 ease-in-out",
            collapsed ? "w-12 px-0 justify-center" : "w-full px-2"
          )}
        >
          <div className="h-10 w-10 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center shrink-0">
            <span className="text-sm font-medium">
              {session?.user?.name?.[0].toUpperCase()}
            </span>
          </div>
          <div
            className={cn(
              "flex flex-col transform transition-all duration-300 ease-in-out overflow-hidden",
              collapsed
                ? "w-0 opacity-0 translate-x-2"
                : "w-auto opacity-100 ml-2"
            )}
          >
            <span className="text-sm font-medium whitespace-nowrap">
              {session?.user?.name}
            </span>
            <span className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
              {session?.user?.email}
            </span>
          </div>
        </div>
        <SettingsDialog collapsed={collapsed} />
        <LogoutDialog collapsed={collapsed} />
      </div>
    </aside>
  );
}
