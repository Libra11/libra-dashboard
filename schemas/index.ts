/*
 * @Author: Libra
 * @Date: 2024-12-06 15:45:48
 * @LastEditors: Libra
 * @Description:
 */
import { z } from "zod";

export const menuFormSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  path: z.string().min(1, "路径不能为空"),
  icon: z.string().optional(),
  sort: z.coerce.number().min(0, "排序不能小于0"),
  parentId: z.string().nullable(),
  isVisible: z.boolean(),
  isDynamic: z.boolean(),
  dynamicName: z.string().default("id"),
});

export const permissionFormSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  code: z.string().min(1, "权限代码不能为空"),
  description: z.string().optional(),
});

export const roleFormSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  description: z.string().optional(),
  permissionIds: z.array(z.string()),
  menuIds: z.array(z.string()),
});

export const userFormSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6位").optional(),
  roleId: z.string().min(1, "请选择角色"),
});
