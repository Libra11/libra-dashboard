/**
 * Author: Libra
 * Date: 2024-12-03 14:42:46
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash, ChevronRight } from "lucide-react";
import { Menu } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/app/components/loading";
import { getAllMenus, deleteMenu } from "@/api/menus";
import { useToast } from "@/hooks/use-toast";
import { MenuForm } from "@/components/forms/menu-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Icon from "@/app/components/icons";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface MenuWithChildren extends Menu {
  children: MenuWithChildren[];
}

export default function MenusPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  const fetchMenus = async () => {
    try {
      const menus = await getAllMenus();
      setMenus(menus);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
      toast({
        title: t("common.error"),
        description: t("dashboard.menus.error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMenu(deleteId);
      toast({
        title: t("common.success"),
        description: t("dashboard.menus.deleteSuccess"),
      });
      fetchMenus();
    } catch (error) {
      console.error("Failed to delete menu:", error);
      toast({
        title: t("common.error"),
        description: t("dashboard.menus.error"),
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const buildMenuTree = (items: Menu[]): MenuWithChildren[] => {
    const menuMap = new Map<string, MenuWithChildren>();
    const tree: MenuWithChildren[] = [];

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

  const toggleExpand = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const renderMenuItem = (menu: MenuWithChildren, level = 0) => {
    const hasChildren = menu.children.length > 0;
    const isExpanded = expandedMenus[menu.id];

    const handleEdit = () => {
      const fullMenu = menus.find((m) => m.id === menu.id);
      if (fullMenu) {
        setSelectedMenu(fullMenu);
        setIsFormOpen(true);
      }
    };

    return (
      <React.Fragment key={menu.id}>
        <TableRow
          className="
            border-b 
            border-[hsl(var(--bg-icon))] 
            hover:bg-[hsl(var(--accent))] 
            transition-all 
            duration-200 
            cursor-pointer
          "
        >
          <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(menu.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[hsl(var(--bg-icon))]"
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isExpanded && "transform rotate-90"
                    )}
                  />
                </button>
              )}
              {!hasChildren && <div className="w-6" />}
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                {menu.icon ? (
                  <Icon
                    name={menu.icon as keyof typeof Icons}
                    className="h-5 w-5 text-[hsl(var(--primary))]"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {menu.name[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className={cn("flex flex-col", level > 0 && "ml-4")}>
                <p className="text-sm font-medium">{t(menu.name)}</p>
                {menu.parentId && (
                  <p className="text-xs text-muted-foreground">
                    {t(menus.find((m) => m.id === menu.parentId)?.name)}
                  </p>
                )}
              </div>
            </div>
          </TableCell>
          <TableCell className="px-6 py-4 text-sm text-muted-foreground min-w-[380px]">
            {menu.path}
          </TableCell>
          <TableCell className="px-6 py-4">
            {menu.icon && (
              <Badge
                variant="secondary"
                className="rounded-lg bg-[hsl(var(--bg-icon))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--bg-icon))]"
              >
                {menu.icon}
              </Badge>
            )}
          </TableCell>
          <TableCell className="px-6 py-4 text-sm text-muted-foreground">
            {menu.sort}
          </TableCell>
          <TableCell className="px-6 py-4">
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-8 w-8 rounded-lg hover:bg-[hsl(var(--bg-icon))]"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(menu.id)}
                className="h-8 w-8 rounded-lg hover:bg-[hsl(var(--bg-icon))]"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {hasChildren &&
          isExpanded &&
          menu.children
            .sort((a, b) => a.sort - b.sort)
            .map((child) => renderMenuItem(child, level + 1))}
      </React.Fragment>
    );
  };

  if (loading) {
    return <Loading text={t("dashboard.menus.loading")} />;
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("dashboard.menus.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard.menus.description")}
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedMenu(null);
            setIsFormOpen(true);
          }}
          className="h-10 px-4 py-2 rounded-xl bg-[hsl(var(--primary))]"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.menus.create")}
        </Button>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[hsl(var(--bg-icon))] hover:bg-transparent">
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.menus.name")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.menus.path")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.menus.icon")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.menus.sort")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground text-right">
                {t("dashboard.menus.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buildMenuTree(menus)
              .sort((a, b) => a.sort - b.sort)
              .map((menu) => renderMenuItem(menu))}
          </TableBody>
        </Table>
      </div>

      <MenuForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedMenu || undefined}
        menus={menus}
        onSuccess={fetchMenus}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.menus.deleteConfirm")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.menus.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("dashboard.menus.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
