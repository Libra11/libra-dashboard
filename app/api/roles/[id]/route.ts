/*
 * @Author: Libra
 * @Date: 2024-12-03 11:16:56
 * @LastEditors: Libra
 * @Description:
 */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// 获取单个角色
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const { id } = await params;
    if (!session) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
        menus: true,
      },
    });

    if (!role) {
      return NextResponse.json({ message: "角色不存在" }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("获取角色失败:", error);
    return NextResponse.json({ message: "获取角色失败" }, { status: 500 });
  }
}

// 更新角色
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const { id } = await params;
    if (!session) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const { name, permissionIds, menuIds } = await req.json();

    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        permissions: {
          set: [], // 先清空所有权限
          connect: permissionIds.map((id: string) => ({ id })), // 重新连接新的权限
        },
        menus: {
          set: [], // 先清空所有菜单
          connect: menuIds.map((id: string) => ({ id })), // 重新连接新的菜单
        },
      },
      include: {
        permissions: true,
        menus: true,
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    console.error("更新角色失败:", error);
    return NextResponse.json({ message: "更新角色失败" }, { status: 500 });
  }
}

// 删除角色
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const { id } = await params;
    if (!session) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    // 检查是否有用户正在使用该角色
    const usersWithRole = await prisma.user.count({
      where: { roleId: id },
    });

    if (usersWithRole > 0) {
      return NextResponse.json(
        { message: "该角色正在被使用，无法删除" },
        { status: 400 }
      );
    }

    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除角色失败:", error);
    return NextResponse.json({ message: "删除角色失败" }, { status: 500 });
  }
}
