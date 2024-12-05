/*
 * @Author: Libra
 * @Date: 2024-12-03 14:48:01
 * @LastEditors: Libra
 * @Description:
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// 获取单个菜单
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const menu = await prisma.menu.findUnique({
      where: { id: params.id },
      include: {
        permissions: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!menu) {
      return new NextResponse("Menu not found", { status: 404 });
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error("[MENU_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// 更新菜单
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // 更新菜单
    const menu = await prisma.menu.update({
      where: { id: params.id },
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
    console.error("[MENU_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// 删除菜单
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 检查是否有子菜单
    const childMenus = await prisma.menu.findMany({
      where: { parentId: params.id },
    });

    if (childMenus.length > 0) {
      return new NextResponse("Cannot delete menu with children", {
        status: 400,
      });
    }

    // 删除菜单
    await prisma.menu.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MENU_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
