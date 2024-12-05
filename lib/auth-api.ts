/*
 * @Author: Libra
 * @Date: 2024-12-02 14:35:10
 * @LastEditors: Libra
 * @Description:
 */
import { fetchApi } from "./fetch";
import { prisma } from "@/lib/prisma";

type RegisterData = {
  email: string;
  password: string;
};

type RegisterResponse = {
  message: string;
};

export const authApi = {
  register: (data: RegisterData) =>
    fetchApi<RegisterResponse>({
      url: "/api/auth/register",
      method: "POST",
      body: data,
    }),
};

/**
 * 检查用户是否拥有指定权限
 * @param userId 用户ID
 * @param permissionName 权限名称
 * @returns 是否拥有权限
 */
export async function hasPermission(
  userId: string,
  permissionName: string
): Promise<boolean> {
  try {
    // 查找用户及其角色和权限
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    // 如果用户不存在或没有角色，返回 false
    if (!user || !user.role) {
      return false;
    }

    // 检查用户的角色是否包含指定权限
    return user.role.permissions.some((permission) => {
      console.log(
        "permission",
        permission.name === permissionName,
        permission.name,
        permissionName
      );
      return permission.name === permissionName;
    });
  } catch (error) {
    console.error("[CHECK_PERMISSION_ERROR]", error);
    return false;
  }
}
