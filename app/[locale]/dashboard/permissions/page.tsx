/**
 * Author: Libra
 * Date: 2024-12-03 17:59:55
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useState, useEffect } from "react";
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
import { Permission } from "@prisma/client";
import { PermissionForm } from "@/components/forms/permission-form";
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
import { deletePermission, getPermissions } from "@/api/permissions";
import { Loading } from "@/app/components/loading";
import { Badge } from "@/components/ui/badge";

export default function PermissionsPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPermissions = async () => {
    try {
      const permissions = await getPermissions();
      setPermissions(permissions);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      toast({
        title: t("common.error"),
        description: t("dashboard.permissions.error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePermission(deleteId);
      toast({
        title: t("common.success"),
        description: t("dashboard.permissions.deleteSuccess"),
      });
      fetchPermissions();
    } catch (error) {
      console.error("Failed to delete permission:", error);
      toast({
        title: t("common.error"),
        description: t("dashboard.permissions.error"),
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
            {t("dashboard.permissions.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard.permissions.description")}
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedPermission(null);
            setIsFormOpen(true);
          }}
          className="h-10 px-4 py-2 rounded-xl bg-[hsl(var(--primary))]"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.permissions.create")}
        </Button>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[hsl(var(--bg-icon))] hover:bg-transparent">
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.permissions.name")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.permissions.code")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.permissions.description")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.permissions.createdAt")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground text-right">
                {t("dashboard.permissions.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow
                key={permission.id}
                className="border-b border-[hsl(var(--bg-icon))] hover:bg-[hsl(var(--accent))] transition-all duration-200 cursor-pointer"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {permission.name[0].toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{permission.name}</p>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className="rounded-lg bg-[hsl(var(--bg-icon))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--bg-icon))]"
                  >
                    {permission.code}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {permission.description}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {format(
                    new Date(permission.createdAt),
                    "yyyy-MM-dd HH:mm:ss"
                  )}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPermission(permission);
                        setIsFormOpen(true);
                      }}
                      className="h-8 w-8 rounded-lg hover:bg-[hsl(var(--bg-icon))]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(permission.id)}
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

      <PermissionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedPermission || undefined}
        onSuccess={fetchPermissions}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.permissions.deleteConfirm")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.permissions.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("dashboard.permissions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
