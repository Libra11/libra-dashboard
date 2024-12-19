/**
 * Author: Libra
 * Date: 2024-12-03 13:13:18
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Clock,
  MapPin,
  Phone,
  Globe,
  Building2,
  Award,
} from "lucide-react";

export default function ProfilePage() {
  const t = useTranslations();
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* 页面标题部分 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("dashboard.profile.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard.profile.description")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 基本信息卡片 */}
        <div className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent">
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <User className="h-5 w-5 text-[hsl(var(--primary))]" />
                  {t("dashboard.profile.basicInfo")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.profile.basicInfoDesc")}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                    <span className="text-2xl font-semibold text-[hsl(var(--primary))]">
                      {user.name?.[0]?.toUpperCase() ||
                        user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{user.name || user.email}</div>
                    <div className="text-sm text-muted-foreground">
                      <Badge variant="secondary" className="mt-1">
                        {user.role?.name || "-"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">+86 138****1234</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Shanghai, China</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {user.createdAt
                        ? format(
                            new Date(user.createdAt),
                            "yyyy-MM-dd HH:mm:ss"
                          )
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 工作信息卡片 */}
        <div className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent">
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[hsl(var(--primary))]" />
                  Work Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your work and department information
                </p>
              </div>

              <div className="grid gap-4">
                <div className="p-4 rounded-xl bg-[hsl(var(--bg-icon))/0.2]">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-5 w-5 text-[hsl(var(--primary))]" />
                    <span className="font-medium">Senior Developer</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Technology Department
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Employee ID
                    </div>
                    <div>EMP10086</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Join Date
                    </div>
                    <div>2023-01-01</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Status
                    </div>
                    <Badge className="bg-[hsl(var(--primary))] text-primary-foreground hover:bg-[hsl(var(--primary))]">
                      Active
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Work Type
                    </div>
                    <div>Full Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 权限信息卡片 */}
      <div className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent">
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <Shield className="h-5 w-5 text-[hsl(var(--primary))]" />
                {t("dashboard.profile.permissions")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.profile.permissionsDesc")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.role?.permissions?.map((permission) => (
                <Badge
                  key={permission.id}
                  variant="outline"
                  className="rounded-lg bg-[hsl(var(--bg-icon))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--bg-icon))]"
                >
                  {permission.name}
                </Badge>
              )) || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
