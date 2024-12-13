/**
 * Author: Libra
 * Date: 2024-12-05 14:11:58
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
import { Permission } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { permissionFormSchema } from "@/schemas";
import { createPermission, updatePermission } from "@/api/permissions";

interface PermissionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Permission;
  onSuccess?: () => void;
}

export function PermissionForm({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: PermissionFormProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof permissionFormSchema>>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        code: initialData.code,
        description: initialData.description || "",
      });
    } else {
      form.reset({
        name: "",
        code: "",
        description: "",
      });
    }
  }, [form, initialData]);

  const onSubmit = async (values: z.infer<typeof permissionFormSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        await updatePermission(initialData.id, values);
      } else {
        await createPermission(values);
      }
      toast({
        title: t("common.success"),
        description: t(
          initialData
            ? "dashboard.permissions.updateSuccess"
            : "dashboard.permissions.createSuccess"
        ),
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast({
        title: t("common.error"),
        description: t("dashboard.permissions.error"),
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
              ? t("dashboard.permissions.edit")
              : t("dashboard.permissions.create")}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? t("dashboard.permissions.editDescription")
              : t("dashboard.permissions.createDescription")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.permissions.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.permissions.code")}</FormLabel>
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
                  <FormLabel>
                    {t("dashboard.permissions.description")}
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
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
