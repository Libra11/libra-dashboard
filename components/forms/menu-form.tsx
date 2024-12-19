/**
 * Author: Libra
 * Date: 2024-12-19 10:49:44
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu } from "@prisma/client";
import { createMenu, updateMenu } from "@/api/menus";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { menuFormSchema } from "@/schemas";
import { useEffect } from "react";

interface MenuFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Menu;
  menus: Menu[];
  onSuccess: () => void;
}

export function MenuForm({
  open,
  onOpenChange,
  initialData,
  menus,
  onSuccess,
}: MenuFormProps) {
  const t = useTranslations();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof menuFormSchema>>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: "",
      path: "",
      icon: "",
      sort: 0,
      parentId: "none",
      isVisible: true,
      isDynamic: false,
      dynamicName: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        path: initialData.path,
        icon: initialData.icon || "",
        sort: initialData.sort,
        parentId: initialData.parentId || "none",
        isVisible: initialData.isVisible,
        isDynamic: initialData.isDynamic,
        dynamicName: initialData.dynamicName || "",
      });
    } else {
      form.reset({
        name: "",
        path: "",
        icon: "",
        sort: 0,
        parentId: "none",
        isVisible: true,
        isDynamic: false,
        dynamicName: "",
      });
    }
  }, [form, initialData]);

  const onSubmit = async (values: z.infer<typeof menuFormSchema>) => {
    try {
      if (initialData) {
        await updateMenu(initialData.id, values);
        toast({
          title: t("common.success"),
          description: t("dashboard.menus.updateSuccess"),
        });
      } else {
        await createMenu(values);
        toast({
          title: t("common.success"),
          description: t("dashboard.menus.createSuccess"),
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save menu:", error);
      toast({
        title: t("common.error"),
        description: t("dashboard.menus.error"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t("dashboard.menus.edit")
              : t("dashboard.menus.create")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.menus.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.menus.path")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.menus.icon")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.menus.sort")}</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dashboard.menus.parent")}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === "none" ? null : value);
                    }}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("dashboard.menus.noParent")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        {t("dashboard.menus.noParent")}
                      </SelectItem>
                      {menus
                        .filter((menu) => menu.id !== initialData?.id)
                        .map((menu) => (
                          <SelectItem key={menu.id} value={menu.id}>
                            {menu.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>{t("dashboard.menus.visible")}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDynamic"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>{t("dashboard.menus.dynamic")}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("isDynamic") && (
              <FormField
                control={form.control}
                name="dynamicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dashboard.menus.dynamicName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? t("common.saving")
                  : t("common.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
