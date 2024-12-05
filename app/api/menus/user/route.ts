/*
 * @Author: Libra
 * @Date: 2024-12-03 16:22:52
 * @LastEditors: Libra
 * @Description:
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 获取用户及其角色
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: {
          select: {
            menus: {
              where: {
                isVisible: true,
              },
              orderBy: {
                sort: "asc",
              },
              select: {
                id: true,
                name: true,
                path: true,
                icon: true,
                sort: true,
                parentId: true,
                isVisible: true,
                isDynamic: true,
                dynamicName: true,
              },
            },
          },
        },
      },
    });

    if (!user?.role?.menus) {
      return NextResponse.json({ menus: [] });
    }

    return NextResponse.json({ menus: user.role.menus });
  } catch (error) {
    console.error("[MENUS_GET_USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
