/*
 * @Author: Libra
 * @Date: 2024-12-06 15:39:20
 * @LastEditors: Libra
 * @Description:
 */

import { fetchApi } from "@/lib/fetch";
import { User, Role } from "@prisma/client";
import { z } from "zod";
import { userFormSchema } from "@/schemas";

export interface UserWithRole extends User {
  role: Role;
}

/**
 * 获取所有用户
 * @returns 用户列表
 */
export const getUsers = async () => {
  const users = await fetchApi<UserWithRole[]>({
    url: "/api/users",
  });
  return users;
};

/**
 * 删除用户
 * @param id 用户ID
 * @returns 删除结果
 */
export const deleteUser = async (id: string) => {
  await fetchApi({ url: `/api/users/${id}`, method: "DELETE" });
};

/**
 * 创建用户
 * @param user 用户
 * @returns 创建结果
 */
export const createUser = async (user: z.infer<typeof userFormSchema>) => {
  await fetchApi({ url: "/api/users", method: "POST", body: user });
};

/**
 * 更新用户
 * @param id 用户ID
 * @param user 用户
 * @returns 更新结果
 */
export const updateUser = async (
  id: string,
  user: z.infer<typeof userFormSchema>
) => {
  await fetchApi({ url: `/api/users/${id}`, method: "PATCH", body: user });
};
