/**
 * Author: Libra
 * Date: 2024-12-03 09:43:16
 * LastEditors: Libra
 * Description:
 */
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
import { Users, FolderKanban, ListTodo, Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const { data: session } = useSession();
  const t = useTranslations();

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent ">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                  <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Employees
                  </p>
                  <p className="text-2xl font-semibold">547</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent ">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                  <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Employees
                  </p>
                  <p className="text-2xl font-semibold">547</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent ">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                  <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Employees
                  </p>
                  <p className="text-2xl font-semibold">547</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent ">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                  <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Employees
                  </p>
                  <p className="text-2xl font-semibold">547</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 其他三个统计卡片使用相同的样式，只需更换图标和数据 */}
        {/* ... */}
      </div>
    </div>
  );
}
