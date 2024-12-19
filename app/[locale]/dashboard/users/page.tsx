/**
 * Author: Libra
 * Date: 2024-12-03 10:58:58
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
import { deleteUser, getUsers, UserWithRole } from "@/api/users";
import { getRoles } from "@/api/roles";
import { Loading } from "@/app/components/loading";

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
      const users = await getUsers();
      setUsers(users);
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
      const roles = await getRoles();
      setRoles(roles);
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
      await deleteUser(deleteId);
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
    return <Loading text={t("dashboard.menus.loading")} />;
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("dashboard.users.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard.users.description")}
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}
          className="h-10 px-4 py-2 rounded-xl bg-[hsl(var(--primary))]"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.users.create")}
        </Button>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[hsl(var(--bg-icon))] hover:bg-transparent">
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.users.name")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.users.email")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.users.role")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground">
                {t("dashboard.users.createdAt")}
              </TableHead>
              <TableHead className="h-12 px-6 text-sm font-medium text-muted-foreground text-right">
                {t("dashboard.users.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="border-b border-[hsl(var(--bg-icon))] hover:bg-[hsl(var(--accent))] transition-all duration-200 cursor-pointer"
              >
                <TableCell className="h-16 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.name?.[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className="rounded-lg bg-[hsl(var(--bg-icon))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--bg-icon))]"
                  >
                    {user.role?.name}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsFormOpen(true);
                      }}
                      className="h-8 w-8 rounded-lg hover:bg-[hsl(var(--bg-icon))]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(user.id)}
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
