import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 获取所有菜单
    const menus = await prisma.menu.findMany({
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

    return NextResponse.json({ menus });
  } catch (error) {
    console.error("[MENUS_GET_ALL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
