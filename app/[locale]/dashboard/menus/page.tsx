/**
 * Author: Libra
 * Date: 2024-12-03 14:42:46
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash } from "lucide-react";
import { Menu } from "@prisma/client";
import { MenuForm } from "@/components/forms/menu-form";
import { useToast } from "@/hooks/use-toast";
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
import { useTranslations } from "next-intl";
import { deleteMenu, getAllMenus } from "@/api/menus";

interface MenuWithChildren extends Menu {
  children: MenuWithChildren[];
}

export default function MenusPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
        description: t("dashboard.menus.deleteChildrenError"),
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const buildMenuTree = (menus: Menu[]): MenuWithChildren[] => {
    const menuMap = new Map<string, MenuWithChildren>();
    const tree: MenuWithChildren[] = [];

    menus.forEach((menu) => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    menus.forEach((menu) => {
      const node = menuMap.get(menu.id)!;
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  };

  const renderMenuRow = (
    menu: MenuWithChildren,
    level: number = 0
  ): JSX.Element => {
    const hasChildren = menu.children.length > 0;
    const isExpanded = expandedRows.has(menu.id);

    return (
      <Fragment key={menu.id}>
        <TableRow>
          <TableCell className="font-medium">
            <div
              className="flex items-center"
              style={{ paddingLeft: `${level * 24}px` }}
            >
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => toggleRow(menu.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              <span className="ml-1">{t(menu.name)}</span>
            </div>
          </TableCell>
          <TableCell>
            {menu.isDynamic ? (
              <div className="space-y-1">
                <div>{menu.path}</div>
                <div className="text-sm text-muted-foreground">
                  {t("dashboard.menus.dynamicName")}: {menu.dynamicName}
                </div>
              </div>
            ) : (
              menu.path
            )}
          </TableCell>
          <TableCell>{menu.sort}</TableCell>
          <TableCell>
            {menu.isVisible
              ? t("dashboard.menus.visible_true")
              : t("dashboard.menus.visible_false")}
          </TableCell>
          <TableCell>
            {format(new Date(menu.createdAt), "yyyy-MM-dd HH:mm:ss")}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedMenu(menu);
                  setIsFormOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(menu.id)}
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
            .map((child) => renderMenuRow(child, level + 1))}
      </Fragment>
    );
  };

  if (loading) {
    return <div>{t("dashboard.menus.loading")}</div>;
  }

  const menuTree = buildMenuTree(menus);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">{t("dashboard.menus.title")}</h2>
        <Button
          onClick={() => {
            setSelectedMenu(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.menus.create")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("dashboard.menus.name")}</TableHead>
            <TableHead>{t("dashboard.menus.path")}</TableHead>
            <TableHead>{t("dashboard.menus.sort")}</TableHead>
            <TableHead>{t("dashboard.menus.visible")}</TableHead>
            <TableHead>{t("dashboard.menus.createdAt")}</TableHead>
            <TableHead>{t("dashboard.menus.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuTree
            .sort((a, b) => a.sort - b.sort)
            .map((menu) => renderMenuRow(menu))}
        </TableBody>
      </Table>

      <MenuForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedMenu || undefined}
        parentMenus={menus}
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
