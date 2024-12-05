import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get("path");
    const userId = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!path || !userId) {
      return NextResponse.json({ hasPermission: false });
    }

    // 获取用户及其角色
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            menus: true,
            permissions: true,
          },
        },
      },
    });

    if (!user?.role) {
      return NextResponse.json({ hasPermission: false });
    }

    // 检查是否是菜单路径
    const isMenuPath = user.role.menus.some((menu) =>
      path.startsWith(menu.path)
    );

    if (isMenuPath) {
      return NextResponse.json({ hasPermission: true });
    }

    // 如果不是菜单路径，允许访问
    return NextResponse.json({ hasPermission: true });
  } catch (error) {
    console.error("[PERMISSIONS_CHECK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
