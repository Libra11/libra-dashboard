import NextAuth, { DefaultSession } from "next-auth";
import { Role, Menu, Permission, User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role:
        | (Role & {
            menus: Menu[];
            permissions: Permission[];
          })
        | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultSession["user"] {
    id: string;
  }
}
