/*
 * @Author: Libra
 * @Date: 2024-12-03 15:43:02
 * @LastEditors: Libra
 * @Description:
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

// 获取单个用户
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return NextResponse.json({ message: "获取用户失败" }, { status: 500 });
  }
}

// 更新用户
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
    const { name, email, password, roleId } = body;

    // 如果更改了邮箱，检查新邮箱是否已存在
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id,
          },
        },
      });

      if (existingUser) {
        return NextResponse.json({ message: "邮箱已存在" }, { status: 400 });
      }
    }

    // 准备更新数据
    const updateData: any = {
      name,
      email,
      roleId,
    };

    // 如果提供了新密码，则更新密码
    if (password) {
      updateData.password = await hash(password, 12);
    }

    // 更新用户
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return NextResponse.json({ message: "更新用户失败" }, { status: 500 });
  }
}

// 删除用户
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

    // 不允许删除自己
    if (id === session.user.id) {
      return NextResponse.json({ message: "不能删除自己" }, { status: 400 });
    }

    // 删除用户
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return NextResponse.json({ message: "删除用户失败" }, { status: 500 });
  }
}
