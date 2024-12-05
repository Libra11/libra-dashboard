/*
 * @Author: Libra
 * @Date: 2024-12-03 14:38:34
 * @LastEditors: Libra
 * @Description:
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// 获取菜单列表
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 获取用户的角色权限
    const userPermissions = await prisma.user
      .findUnique({
        where: { id: session.user.id },
        select: {
          role: {
            select: {
              permissions: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })
      .then((user) => user?.role?.permissions.map((p) => p.name) || []);

    // 获取所有菜单
    const allMenus = await prisma.menu.findMany({
      include: {
        permissions: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        sort: "asc",
      },
    });

    // 过滤掉用户没有权限的菜单
    const menus = allMenus.filter((menu) => {
      // 如果菜单没有设置权限要求，则显示
      if (menu.permissions.length === 0) {
        return true;
      }
      // 如果菜单设置了权限要求，检查用户是否拥有任一所需权限
      return menu.permissions.some((permission) =>
        userPermissions.includes(permission.name)
      );
    });

    return NextResponse.json({ menus });
  } catch (error) {
    console.error("[MENUS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// 创建新菜单
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      path,
      icon,
      sort,
      parentId,
      isVisible,
      isDynamic,
      dynamicName,
    } = body;

    // 创建菜单
    const menu = await prisma.menu.create({
      data: {
        name,
        path,
        icon,
        sort,
        parentId,
        isVisible,
        isDynamic,
        dynamicName,
      },
      include: {
        permissions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error("[MENU_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
