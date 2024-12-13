/*
 * @Author: Libra
 * @Date: 2024-12-06 15:25:45
 * @LastEditors: Libra
 * @Description:
 */

import { fetchApi } from "@/lib/fetch";
import { Menu } from "@prisma/client";
import { z } from "zod";
import { menuFormSchema } from "@/schemas";

/**
 * 获取所有菜单
 * @returns 菜单列表
 */
export const getAllMenus = async () => {
  const data = await fetchApi<{ menus: Menu[] }>({
    url: "/api/menus/all",
  });
  return data.menus;
};

/**
 * 删除菜单
 * @param id 菜单ID
 * @returns 删除结果
 */
export const deleteMenu = async (id: string) => {
  await fetchApi({ url: `/api/menus/${id}`, method: "DELETE" });
};

/**
 * 获取用户菜单
 * @returns 菜单列表
 */
export const getUserMenus = async () => {
  const data = await fetchApi<{ menus: Menu[] }>({
    url: "/api/menus/user",
  });
  return data.menus;
};

/**
 * 创建菜单
 * @param menu 菜单
 * @returns 创建结果
 */
export const createMenu = async (menu: z.infer<typeof menuFormSchema>) => {
  await fetchApi({ url: "/api/menus", method: "POST", body: menu });
};

/**
 * 更新菜单
 * @param menu 菜单
 * @returns 更新结果
 */
export const updateMenu = async (
  id: string,
  menu: z.infer<typeof menuFormSchema>
) => {
  await fetchApi({ url: `/api/menus/${id}`, method: "PATCH", body: menu });
};
