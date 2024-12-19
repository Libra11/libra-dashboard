/**
 * Author: Libra
 * Date: 2024-12-03 11:15:54
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
import { format } from "date-fns";
import { Plus, Pencil, Trash } from "lucide-react";
import { Role, Permission, Menu } from "@prisma/client";
import { RoleForm } from "@/components/forms/role-form";
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
import { Badge } from "@/components/ui/badge";
import { deleteRole, getRoles, RoleWithRelations } from "@/api/roles";
import { getPermissions } from "@/api/permissions";
import { getAllMenus } from "@/api/menus";
import { Loading } from "@/app/components/loading";

export default function RolesPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const [roles, setRoles] = useState<RoleWithRelations[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<RoleWithRelations | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      const roles = await getRoles();
      setRoles(roles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast({
        title: t("common.error"),
        description: t("dashboard.roles.error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const permissions = await getPermissions();
      setPermissions(permissions);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  const fetchMenus = async () => {
    try {
      const menus = await getAllMenus();
      setMenus(menus);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    fetchMenus();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRole(deleteId);
      toast({
        title: t("common.success"),
        description: t("dashboard.roles.deleteSuccess"),
      });
      fetchRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast({
        title: t("common.error"),
        description: t("dashboard.roles.error"),
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <Loading text={t("dashboard.menus.loading")} />;
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("dashboard.roles.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard.roles.description")}
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedRole(null);
            setIsFormOpen(true);
          }}
          className="h-10 px-4 py-2 rounded-xl bg-[hsl(var(--primary))]"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.roles.create")}
        </Button>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[hsl(var(--bg-icon))] hover:bg-transparent">
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.roles.name")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.roles.description")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.roles.permissions")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.roles.users")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.roles.createdAt")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground text-right">
                {t("dashboard.roles.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow
                key={role.id}
                className="border-b border-[hsl(var(--bg-icon))] hover:bg-[hsl(var(--accent))] transition-all duration-200 cursor-pointer"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {role.name[0].toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{role.name}</p>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {role.description}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission) => (
                      <Badge
                        key={permission.id}
                        variant="secondary"
                        className="rounded-lg bg-[hsl(var(--bg-icon))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--bg-icon))]"
                      >
                        {permission.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {role._count.users}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {format(new Date(role.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedRole(role);
                        setIsFormOpen(true);
                      }}
                      className="h-8 w-8 rounded-lg hover:bg-[hsl(var(--bg-icon))]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(role.id)}
                      className="h-8 w-8 rounded-lg hover:bg-[hsl(var(--bg-icon))]"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RoleForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedRole || undefined}
        permissions={permissions}
        menus={menus}
        onSuccess={fetchRoles}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.roles.deleteConfirm")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.roles.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("dashboard.roles.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
