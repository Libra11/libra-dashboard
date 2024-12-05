/*
 * @Author: Libra
 * @Date: 2024-12-03 18:01:46
 * @LastEditors: Libra
 * @Description:
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// 获取单个权限
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const { id } = await params;
    if (!session?.user) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      return NextResponse.json({ message: "权限不存在" }, { status: 404 });
    }

    return NextResponse.json(permission);
  } catch (error) {
    console.error("[PERMISSION_GET]", error);
    return NextResponse.json({ message: "获取权限失败" }, { status: 500 });
  }
}

// 更新权限
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const { id } = await params;
    if (!session?.user) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, description } = body;

    // 检查权限代码是否已被其他权限使用
    const existingPermission = await prisma.permission.findFirst({
      where: {
        OR: [{ name }, { code }],
        NOT: {
          id,
        },
      },
    });

    if (existingPermission) {
      return NextResponse.json(
        { message: "权限名称或代码已存在" },
        { status: 400 }
      );
    }

    const permission = await prisma.permission.update({
      where: { id },
      data: {
        name,
        code,
        description,
      },
    });

    return NextResponse.json(permission);
  } catch (error) {
    console.error("[PERMISSION_PATCH]", error);
    return NextResponse.json({ message: "更新权限失败" }, { status: 500 });
  }
}

// 删除权限
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const { id } = await params;
    if (!session?.user) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    // 检查权限是否被角色使用
    const rolesUsingPermission = await prisma.role.count({
      where: {
        permissions: {
          some: {
            id,
          },
        },
      },
    });

    if (rolesUsingPermission > 0) {
      return NextResponse.json(
        { message: "该权限正在被角色使用，无法删除" },
        { status: 400 }
      );
    }

    await prisma.permission.delete({
      where: { id },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("[PERMISSION_DELETE]", error);
    return NextResponse.json({ message: "删除权限失败" }, { status: 500 });
  }
}
