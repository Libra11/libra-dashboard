/**
 * Author: Libra
 * Date: 2024-11-29 17:10:34
 * LastEditors: Libra
 * Description:
 */
"use client";

import { signOut } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ColorThemeSwitcher } from "@/components/color-theme-switcher";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useLocaleStore } from "@/store/locale";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/fetch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon: string;
  sort: number;
  parentId: string | null;
  isVisible: boolean;
  isDynamic: boolean;
  dynamicName: string;
}

interface MenuTreeItem extends MenuItem {
  children: MenuTreeItem[];
}

export function AppSidebar() {
  const t = useTranslations();
  const { locale } = useLocaleStore();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // 获取菜单数据
  useEffect(() => {
    const fetchMenus = async () => {
      if (session?.user?.id) {
        try {
          const data = await fetchApi<{ menus: MenuItem[] }>({
            url: "/api/menus/user",
          });
          setMenuItems(data.menus);
        } catch (error) {
          console.error("Error fetching menus:", error);
          setMenuItems([]);
        }
      }
    };

    fetchMenus();
  }, [session]);

  // 构建菜单树
  const createTreeMenu = (items: MenuItem[]): MenuTreeItem[] => {
    const menuMap = new Map<string, MenuTreeItem>();
    const tree: MenuTreeItem[] = [];

    // 首先创建所有节点的映射
    items.forEach((item) => {
      menuMap.set(item.id, { ...item, children: [] });
    });

    // 构建树结构
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

  // 构建带有语言前缀的URL
  const getLocalizedUrl = (url: string) => {
    return locale === "zh" ? url : `/${locale}${url}`;
  };

  // 渲染菜单项
  const renderMenuItem = (item: MenuTreeItem) => {
    const hasChildren = item.children.length > 0;
    const isActive = pathname.startsWith(getLocalizedUrl(item.path));

    if (hasChildren) {
      return (
        <Collapsible key={item.id} defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <span>{t(item.name)}</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {/* 添加根菜单自身作为第一个子项 */}
                <SidebarMenuSubItem key={`${item.id}-self`}>
                  <Link href={getLocalizedUrl(item.path)}>
                    <span>{t(item.name)}</span>
                  </Link>
                </SidebarMenuSubItem>
                {/* 渲染其他子菜单 */}
                {item.children
                  .sort((a, b) => a.sort - b.sort)
                  .map((child) => (
                    <SidebarMenuSubItem key={child.id}>
                      <Link href={getLocalizedUrl(child.path)}>
                        <span>{t(child.name)}</span>
                      </Link>
                    </SidebarMenuSubItem>
                  ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton asChild>
          <Link href={getLocalizedUrl(item.path)}>
            <span>{t(item.name)}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };
  const menuTree = createTreeMenu(menuItems);
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.title")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuTree
                .sort((a, b) => a.sort - b.sort)
                .map((item) => renderMenuItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeSwitcher />
        <ColorThemeSwitcher />
        <LocaleSwitcher />
        <Button variant="outline" onClick={() => signOut()}>
          {t("common.logout")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
