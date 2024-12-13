/*
 * @Author: Libra
 * @Date: 2024-12-06 15:30:51
 * @LastEditors: Libra
 * @Description:
 */

import { fetchApi } from "@/lib/fetch";
import { Permission } from "@prisma/client";
import { z } from "zod";
import { permissionFormSchema } from "@/schemas";

/**
 * 获取所有权限
 * @returns 权限列表
 */
export const getPermissions = async () => {
  const permissions = await fetchApi<Permission[]>({
    url: "/api/permissions",
  });
  return permissions;
};

/**
 * 删除权限
 * @param id 权限ID
 * @returns 删除结果
 */
export const deletePermission = async (id: string) => {
  await fetchApi({ url: `/api/permissions/${id}`, method: "DELETE" });
};

/**
 * 创建权限
 * @param permission 权限
 * @returns 创建结果
 */
export const createPermission = async (
  permission: z.infer<typeof permissionFormSchema>
) => {
  await fetchApi({ url: "/api/permissions", method: "POST", body: permission });
};

/**
 * 更新权限
 * @param id 权限ID
 * @param permission 权限
 * @returns 更新结果
 */
export const updatePermission = async (
  id: string,
  permission: z.infer<typeof permissionFormSchema>
) => {
  await fetchApi({
    url: `/api/permissions/${id}`,
    method: "PATCH",
    body: permission,
  });
};
