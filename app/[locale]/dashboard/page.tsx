"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session } = useSession();
  const t = useTranslations();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("dashboard.welcome", { email: session?.user?.email })}
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.overview.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.overview.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>{/* 这里可以添加具体的统计数据 */}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.activity.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.activity.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>{/* 这里可以添加活动列表 */}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.settings.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.settings.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>{/* 这里可以添加快速设置选项 */}</CardContent>
        </Card>
      </div>
    </div>
  );
}
