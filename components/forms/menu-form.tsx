/**
 * Author: Libra
 * Date: 2024-12-05 13:49:18
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu } from "@prisma/client";
import { fetchApi } from "@/lib/fetch";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  path: z.string().min(1, "路径不能为空"),
  icon: z.string().optional(),
  sort: z.coerce.number().min(0, "排序不能小于0"),
  parentId: z.string().nullable(),
  isVisible: z.boolean(),
  isDynamic: z.boolean(),
  dynamicName: z.string().default("id"),
});

interface MenuFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Menu;
  parentMenus?: Menu[];
  onSuccess?: () => void;
}

export function MenuForm({
  open,
  onOpenChange,
  initialData,
  parentMenus = [],
  onSuccess,
}: MenuFormProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      path: initialData?.path || "",
      icon: initialData?.icon || "",
      sort: initialData?.sort || 0,
      parentId: initialData?.parentId || null,
      isVisible: initialData?.isVisible ?? true,
      isDynamic: initialData?.isDynamic ?? false,
      dynamicName: initialData?.dynamicName || "id",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        path: initialData.path,
        icon: initialData.icon || "",
        sort: initialData.sort,
        parentId: initialData.parentId,
        isVisible: initialData.isVisible,
        isDynamic: initialData.isDynamic,
        dynamicName: initialData.dynamicName,
      });
    } else {
      form.reset({
        name: "",
        path: "",
        icon: "",
        sort: 0,
        parentId: null,
        isVisible: true,
        isDynamic: false,
        dynamicName: "id",
      });
    }
  }, [form, initialData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        await fetchApi({
          url: `/api/menus/${initialData.id}`,
          method: "PATCH",
          body: JSON.stringify(values),
        });
      } else {
        await fetchApi({
          url: "/api/menus",
          method: "POST",
          body: JSON.stringify(values),
        });
      }
      toast({
        title: t("common.success"),
        description: t(
          initialData
            ? "dashboard.menus.updateSuccess"
            : "dashboard.menus.createSuccess"
        ),
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast({
        title: t("common.error"),
        description: t("dashboard.menus.error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const watchIsDynamic = form.watch("isDynamic");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
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
                    <Input type="number" {...field} />
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
                    onValueChange={(value) =>
                      field.onChange(value === "null" ? null : value)
                    }
                    value={field.value || "null"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("dashboard.menus.noParent")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">
                        {t("dashboard.menus.noParent")}
                      </SelectItem>
                      {parentMenus.map((menu) => (
                        <SelectItem key={menu.id} value={menu.id}>
                          {t(menu.name)}
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("dashboard.menus.visible")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDynamic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("dashboard.menus.dynamic")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {watchIsDynamic && (
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
