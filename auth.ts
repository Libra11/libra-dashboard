/*
 * @Author: Libra
 * @Date: 2024-11-29 17:40:08
 * @LastEditors: Libra
 * @Description:
 */
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      createdAt?: Date;
      role?: {
        id: string;
        name: string;
        permissions: {
          id: string;
          name: string;
          code: string;
        }[];
        menus: {
          id: string;
          name: string;
          path: string;
          icon?: string | null;
          sort: number;
          parentId?: string | null;
          isVisible: boolean;
          isDynamic: boolean;
        }[];
      } | null;
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        const userWithRole = await prisma.user.findUnique({
          where: { email: user.email! },
          include: {
            role: {
              include: {
                menus: true,
                permissions: true,
              },
            },
          },
        });
        token.role = userWithRole?.role || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as any;
      }
      return session;
    },
  },
});
