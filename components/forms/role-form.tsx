/**
 * Author: Libra
 * Date: 2024-12-05 14:51:52
 * LastEditors: Libra
 * Description:
 */
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Role, Permission, Menu } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { roleFormSchema } from "@/schemas";
import { createRole, updateRole } from "@/api/roles";

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Role & {
    permissions: Permission[];
    menus: Menu[];
  };
  permissions?: Permission[];
  menus?: Menu[];
  onSuccess?: () => void;
}

export function RoleForm({
  open,
  onOpenChange,
  initialData,
  permissions = [],
  menus = [],
  onSuccess,
}: RoleFormProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
      menuIds: [],
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || "",
        permissionIds: initialData.permissions.map((p) => p.id),
        menuIds: initialData.menus.map((m) => m.id),
      });
    } else {
      form.reset({
        name: "",
        description: "",
        permissionIds: [],
        menuIds: [],
      });
    }
  }, [form, initialData]);

  const onSubmit = async (values: z.infer<typeof roleFormSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        await updateRole(initialData.id, values);
      } else {
        await createRole(values);
      }
      toast({
        title: t("common.success"),
        description: t(
          initialData
            ? "dashboard.roles.updateSuccess"
            : "dashboard.roles.createSuccess"
        ),
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast({
        title: t("common.error"),
        description: t("dashboard.roles.error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t("dashboard.roles.edit")
              : t("dashboard.roles.create")}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? t("dashboard.roles.editDescription")
              : t("dashboard.roles.createDescription")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.roles.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.roles.description")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissionIds"
              render={() => (
                <FormItem>
                  <FormLabel>{t("dashboard.roles.permissions")}</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {permissions.map((permission) => (
                      <FormField
                        key={permission.id}
                        control={form.control}
                        name="permissionIds"
                        render={({ field }) => (
                          <FormItem
                            key={permission.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(permission.id)}
                                onCheckedChange={(checked) => {
                                  const value = field.value || [];
                                  return checked
                                    ? field.onChange([...value, permission.id])
                                    : field.onChange(
                                        value.filter(
                                          (id) => id !== permission.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                {permission.name}
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {permission.code}
                                </span>
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="menuIds"
              render={() => (
                <FormItem>
                  <FormLabel>{t("dashboard.roles.menus")}</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {menus.map((menu) => (
                      <FormField
                        key={menu.id}
                        control={form.control}
                        name="menuIds"
                        render={({ field }) => (
                          <FormItem
                            key={menu.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(menu.id)}
                                onCheckedChange={(checked) => {
                                  const value = field.value || [];
                                  return checked
                                    ? field.onChange([...value, menu.id])
                                    : field.onChange(
                                        value.filter((id) => id !== menu.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>{t(menu.name)}</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
