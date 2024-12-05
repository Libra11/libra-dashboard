"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const t = useTranslations();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission("settings.edit");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">系统设置</h2>
        {canEdit && <Button>保存更改</Button>}
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>通知设置</CardTitle>
            <CardDescription>配置系统通知选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">邮件通知</Label>
              <Switch id="email-notifications" disabled={!canEdit} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">推送通知</Label>
              <Switch id="push-notifications" disabled={!canEdit} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>安全设置</CardTitle>
            <CardDescription>配置系统安全选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">双因素认证</Label>
              <Switch id="two-factor" disabled={!canEdit} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="session-timeout">会话超时保护</Label>
              <Switch id="session-timeout" disabled={!canEdit} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
