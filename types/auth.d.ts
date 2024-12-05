/*
 * @Author: Libra
 * @Date: 2024-12-03 10:42:26
 * @LastEditors: Libra
 * @Description:
 */
export type Permission = string;

export type Role = "admin" | "user" | "guest";

export interface UserRole {
  id: string;
  name: Role;
  permissions: Permission[];
}

// 扩展 next-auth 的 Session 和 User 类型
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      createdAt: Date;
      permissions: Permission[];
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    permissions: Permission[];
  }
}
