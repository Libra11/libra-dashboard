/*
 * @Author: Libra
 * @Date: 2024-12-03 11:17:07
 * @LastEditors: Libra
 * @Description:
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// 获取所有权限
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const permissions = await prisma.permission.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(permissions);
  } catch (error) {
    console.error("[PERMISSIONS_GET]", error);
    return NextResponse.json({ message: "获取权限列表失败" }, { status: 500 });
  }
}

// 创建新权限
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, description } = body;

    if (!name || !code) {
      return NextResponse.json(
        { message: "名称和权限代码不能为空" },
        { status: 400 }
      );
    }

    // 检查权限代码是否已存在
    const existingPermission = await prisma.permission.findFirst({
      where: {
        OR: [{ name }, { code }],
      },
    });

    if (existingPermission) {
      return NextResponse.json(
        { message: "权限名称或代码已存在" },
        { status: 400 }
      );
    }

    const permission = await prisma.permission.create({
      data: {
        name,
        code,
        description: description || "",
      },
    });

    return NextResponse.json(permission);
  } catch (error) {
    console.error("[PERMISSION_POST]", error);
    return NextResponse.json({ message: "创建权限失败" }, { status: 500 });
  }
}
