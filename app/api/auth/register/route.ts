/*
 * @Author: Libra
 * @Date: 2024-11-29 17:41:36
 * @LastEditors: Libra
 * @Description:
 */
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = userSchema.parse(body);

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "该邮箱已被注册",
        },
        { status: 409 }
      );
    }

    // 获取默认角色（user）
    const defaultRole = await prisma.role.findUnique({
      where: { name: "user" },
    });

    if (!defaultRole) {
      return NextResponse.json(
        {
          message: "系统错误：默认角色不存在",
        },
        { status: 500 }
      );
    }

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        roleId: defaultRole.id,
      },
    });

    return NextResponse.json(
      {
        message: "注册成功",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json(
      {
        message: "注册失败",
      },
      { status: 500 }
    );
  }
}
