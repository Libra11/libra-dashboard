/**
 * Author: Libra
 * Date: 2024-12-03 10:58:58
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
import { Role, User } from "@prisma/client";
import { UserForm } from "@/components/forms/user-form";
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

interface UserWithRole extends User {
  role: Role;
}

export default function UsersPage() {
  const t = useTranslations();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await fetchApi<UserWithRole[]>({
        url: "/api/users",
      });
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: t("common.error"),
        description: t("dashboard.users.error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await fetchApi<Role[]>({
        url: "/api/roles",
      });
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetchApi({
        url: `/api/users/${deleteId}`,
        method: "DELETE",
      });
      toast({
        title: t("common.success"),
        description: t("dashboard.users.deleteSuccess"),
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: t("common.error"),
        description: t("dashboard.users.error"),
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <div>{t("dashboard.users.loading")}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">{t("dashboard.users.title")}</h2>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.users.create")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("dashboard.users.name")}</TableHead>
            <TableHead>{t("dashboard.users.email")}</TableHead>
            <TableHead>{t("dashboard.users.role")}</TableHead>
            <TableHead>{t("dashboard.users.createdAt")}</TableHead>
            <TableHead>{t("dashboard.users.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">{user.role?.name}</Badge>
              </TableCell>
              <TableCell>
                {format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(user.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedUser || undefined}
        roles={roles}
        onSuccess={fetchUsers}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.users.deleteConfirm")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.users.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("dashboard.users.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
