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
    return <div>{t("dashboard.permissions.loading")}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">
          {t("dashboard.permissions.title")}
        </h2>
        <Button
          onClick={() => {
            setSelectedPermission(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.permissions.create")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("dashboard.permissions.name")}</TableHead>
            <TableHead>{t("dashboard.permissions.code")}</TableHead>
            <TableHead>{t("dashboard.permissions.description")}</TableHead>
            <TableHead>{t("dashboard.permissions.createdAt")}</TableHead>
            <TableHead>{t("dashboard.permissions.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell>{permission.name}</TableCell>
              <TableCell>{permission.code}</TableCell>
              <TableCell>{permission.description}</TableCell>
              <TableCell>
                {format(new Date(permission.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedPermission(permission);
                      setIsFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(permission.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
