/*
 * @Author: Libra
 * @Date: 2024-12-06 15:33:48
 * @LastEditors: Libra
 * @Description:
 */

import { fetchApi } from "@/lib/fetch";
import { Role } from "@prisma/client";
import { Permission } from "@prisma/client";
import { Menu } from "@prisma/client";
import { z } from "zod";
import { roleFormSchema } from "@/schemas";

export interface RoleWithRelations extends Role {
  permissions: Permission[];
  menus: Menu[];
  _count: {
    users: number;
  };
}
/**
 * 获取所有角色
 * @returns 角色列表
 */
export const getRoles = async () => {
  const roles = await fetchApi<RoleWithRelations[]>({
    url: "/api/roles",
  });
  return roles;
};

/**
 * 删除角色
 * @param id 角色ID
 * @returns 删除结果
 */
export const deleteRole = async (id: string) => {
  await fetchApi({ url: `/api/roles/${id}`, method: "DELETE" });
};

/**
 * 创建角色
 * @param role 角色
 * @returns 创建结果
 */
export const createRole = async (role: z.infer<typeof roleFormSchema>) => {
  await fetchApi({ url: "/api/roles", method: "POST", body: role });
};

/**
 * 更新角色
 * @param id 角色ID
 * @param role 角色
 * @returns 更新结果
 */
export const updateRole = async (
  id: string,
  role: z.infer<typeof roleFormSchema>
) => {
  await fetchApi({ url: `/api/roles/${id}`, method: "PUT", body: role });
};
