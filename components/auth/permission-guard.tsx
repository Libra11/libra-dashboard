/**
 * Author: Libra
 * Date: 2024-12-03 10:42:58
 * LastEditors: Libra
 * Description:
 */
"use client";

import { ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getLocale } from "next-intl/server";
import { useLocaleStore } from "@/store/locale";

interface PermissionGuardProps {
  children: ReactNode;
}

const PermissionGuard = ({ children }: PermissionGuardProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  let pathname = usePathname();
  const [hasAccess, setHasAccess] = useState(true);
  const { locale } = useLocaleStore();

  useEffect(() => {
    if (!session?.user) {
      return;
    }
    // 先考虑语言，如果不是中文，则去掉语言部分
    if (locale !== "zh") {
      pathname = pathname.slice(3);
    }

    const userMenus = session.user.role?.menus || [];

    let hasAccess = false;
    for (const menu of userMenus) {
      if (menu.isDynamic) {
        // menu.path /dashboard/users/[id]
        // pathname /dashboard/users/1
        const pathPattern = menu.path.replace(/\[([^\]]+)\]/g, "([^/]+)");
        const regex = new RegExp(`^${pathPattern.replace(/\//g, "\\/")}$`);
        if (regex.test(pathname)) {
          hasAccess = true;
          break;
        }
      } else {
        if (pathname === menu.path) {
          hasAccess = true;
          break;
        }
      }
    }

    setHasAccess(hasAccess);
  }, [session, pathname]);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>无权访问</AlertTitle>
          <AlertDescription>您没有访问此页面的权限。</AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/dashboard")}
          >
            返回仪表板
          </Button>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
