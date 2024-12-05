/*
 * @Author: Libra
 * @Date: 2024-11-29 17:40:35
 * @LastEditors: Libra
 * @Description:
 */
import { auth } from "@/auth";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n";

const publicPages = ["/auth/login", "/auth/register"];

// 创建国际化中间件
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

// 创建认证中间件
async function authMiddleware(req: NextRequest) {
  const session = await auth();
  const url = new URL(req.url);

  // 如果是公共页面，直接使用国际化中间件
  if (publicPages.some((page) => url.pathname.endsWith(page))) {
    return intlMiddleware(req);
  }

  // 如果是仪表板页面且未登录，重定向到登录页
  if (url.pathname.startsWith("/dashboard") && !session?.user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 其他情况使用国际化中间件
  return intlMiddleware(req);
}

export default authMiddleware;

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
