/**
 * Author: Libra
 * Date: 2024-12-03 11:15:54
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { fetchApi } from "@/lib/fetch";
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

interface RoleWithRelations extends Role {
  permissions: Permission[];
  menus: Menu[];
  _count: {
    users: number;
  };
}

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
      const data = await fetchApi<RoleWithRelations[]>({
        url: "/api/roles",
      });
      setRoles(data);
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
      const data = await fetchApi<Permission[]>({
        url: "/api/permissions",
      });
      setPermissions(data);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  const fetchMenus = async () => {
    try {
      const data = await fetchApi<{ menus: Menu[] }>({
        url: "/api/menus/all",
      });
      setMenus(data.menus);
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
      await fetchApi({
        url: `/api/roles/${deleteId}`,
        method: "DELETE",
      });
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
    return <div>{t("dashboard.roles.loading")}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">{t("dashboard.roles.title")}</h2>
        <Button
          onClick={() => {
            setSelectedRole(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.roles.create")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("dashboard.roles.name")}</TableHead>
            <TableHead>{t("dashboard.roles.description")}</TableHead>
            <TableHead>{t("dashboard.roles.permissions")}</TableHead>
            <TableHead>{t("dashboard.roles.users")}</TableHead>
            <TableHead>{t("dashboard.roles.createdAt")}</TableHead>
            <TableHead>{t("dashboard.roles.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission) => (
                    <Badge key={permission.id} variant="secondary">
                      {permission.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{role._count.users}</TableCell>
              <TableCell>
                {format(new Date(role.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedRole(role);
                      setIsFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(role.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
