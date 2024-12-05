/*
 * @Author: Libra
 * @Date: 2024-12-03 11:11:19
 * @LastEditors: Libra
 * @Description:
 */
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    {
      name: "用户管理",
      code: "user_manage",
      description: "用户管理权限",
    },
    {
      name: "角色管理",
      code: "role_manage",
      description: "角色管理权限",
    },
    {
      name: "菜单管理",
      code: "menu_manage",
      description: "菜单管理权限",
    },
  ];

  // 创建权限
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: {},
      create: permission,
    });
  }

  // 创建角色
  const adminRole = await prisma.role.upsert({
    where: { name: "管理员" },
    update: {},
    create: {
      name: "管理员",
      description: "系统管理员",
      permissions: {
        connect: permissions.map((p) => ({ code: p.code })),
      },
    },
  });

  // 创建用户
  const password = await hash("123456", 12);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      password,
      roleId: adminRole.id,
    },
  });

  // 创建菜单
  const dashboardMenu = await prisma.menu.upsert({
    where: { id: "dashboard" },
    update: {},
    create: {
      id: "dashboard",
      name: "nav.dashboard",
      path: "/dashboard",
      icon: "LayoutDashboard",
      sort: 1,
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });

  await prisma.menu.upsert({
    where: { id: "users" },
    update: {},
    create: {
      id: "users",
      name: "nav.users.title",
      path: "/users",
      icon: "Users",
      sort: 2,
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });

  await prisma.menu.upsert({
    where: { id: "roles" },
    update: {},
    create: {
      id: "roles",
      name: "nav.roles",
      path: "/roles",
      icon: "Shield",
      sort: 3,
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });

  await prisma.menu.upsert({
    where: { id: "menus" },
    update: {},
    create: {
      id: "menus",
      name: "nav.menus",
      path: "/menus",
      icon: "Menu",
      sort: 4,
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
