/*
 * @Author: Libra
 * @Date: 2024-12-03 11:16:36
 * @LastEditors: Libra
 * @Description:
 */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// 获取所有角色
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    if (!prisma) {
      throw new Error("Database connection failed");
    }

    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: {
            users: true,
            permissions: true,
            menus: true,
          },
        },
        permissions: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        menus: {
          select: {
            id: true,
            name: true,
            path: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(roles);
  } catch (error) {
    console.error("获取角色列表失败:", error);
    return NextResponse.json(
      {
        message: "获取角色列表失败",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 创建新角色
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    if (!prisma) {
      throw new Error("Database connection failed");
    }

    const { name, permissions, menus } = await req.json();

    // 检查角色名是否已存在
    const existingRole = await prisma.role.findUnique({
      where: { name },
    });

    if (existingRole) {
      return NextResponse.json({ message: "角色名已存在" }, { status: 400 });
    }

    const role = await prisma.role.create({
      data: {
        name,
        permissions: {
          connect: permissions.map((id: string) => ({ id })),
        },
        menus: {
          connect: menus.map((id: string) => ({ id })),
        },
      },
      include: {
        permissions: true,
        menus: true,
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    console.error("创建角色失败:", error);
    return NextResponse.json(
      {
        message: "创建角色失败",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
