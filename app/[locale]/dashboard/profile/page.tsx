/**
 * Author: Libra
 * Date: 2024-12-03 13:13:18
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ProfilePage() {
  const t = useTranslations();
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("dashboard.profile.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("dashboard.profile.description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.profile.basicInfo")}</CardTitle>
          <CardDescription>
            {t("dashboard.profile.basicInfoDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {t("dashboard.profile.email")}
              </div>
              <div>{user.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {t("dashboard.profile.name")}
              </div>
              <div>{user.name || "-"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {t("dashboard.profile.role")}
              </div>
              <div>
                <Badge variant="secondary">{user.role?.name || "-"}</Badge>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {t("dashboard.profile.createdAt")}
              </div>
              <div>
                {user.createdAt
                  ? format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss")
                  : "-"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.profile.permissions")}</CardTitle>
          <CardDescription>
            {t("dashboard.profile.permissionsDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.role?.permissions?.map((permission) => (
              <Badge
                key={permission.id}
                variant="outline"
                className="whitespace-nowrap"
              >
                {permission.name}
              </Badge>
            )) || "-"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
