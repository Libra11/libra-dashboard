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
import { Users } from "lucide-react";
import { Component as ChartExample } from "@/app/components/chart-example";
import { Bell, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const { data: session } = useSession();
  const t = useTranslations();

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-[hsl(var(--bg-icon))] shadow-md">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {session?.user.email}
            </h2>
            <p className="text-muted-foreground">
              {t("dashboard.welcome")} {session?.user?.name}
            </p>
          </div>
        </div>
      </div>

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
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <Card className="rounded-xl border border-[hsl(var(--bg-icon))] hover:border-primary/50 transition-colors duration-200 shadow-sm bg-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                      <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Journey Scarves
                      </h3>
                      <p className="text-sm text-muted-foreground/60">
                        Rebranding and Website Design
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      Status: <span className="font-medium">On Going</span>
                    </div>
                    <div className="text-sm font-medium">51%</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border border-[hsl(var(--bg-icon))] hover:border-primary/50 transition-colors duration-200 shadow-sm bg-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                      <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Journey Scarves
                      </h3>
                      <p className="text-sm text-muted-foreground/60">
                        Rebranding and Website Design
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      Status: <span className="font-medium">On Going</span>
                    </div>
                    <div className="text-sm font-medium">51%</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border border-[hsl(var(--bg-icon))] hover:border-primary/50 transition-colors duration-200 shadow-sm bg-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                      <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Journey Scarves
                      </h3>
                      <p className="text-sm text-muted-foreground/60">
                        Rebranding and Website Design
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      Status: <span className="font-medium">On Going</span>
                    </div>
                    <div className="text-sm font-medium">51%</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border border-[hsl(var(--bg-icon))] hover:border-primary/50 transition-colors duration-200 shadow-sm bg-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                      <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Journey Scarves
                      </h3>
                      <p className="text-sm text-muted-foreground/60">
                        Rebranding and Website Design
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                      <div className="h-8 w-8 rounded-full border-2 border-background bg-[hsl(var(--bg-icon))]"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      Status: <span className="font-medium">On Going</span>
                    </div>
                    <div className="text-sm font-medium">51%</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-6">
          <ChartExample />
          <Card className="rounded-2xl border h-[100px] border-[hsl(var(--bg-icon))] shadow-[0_10px_20px_rgba(0,0,0,0.05)] bg-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                    <Bell className="h-5 w-5 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">团队会议提醒</h3>
                    <p className="text-xs text-muted-foreground">
                      今天 15:30 - 产品评审会议
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                  >
                    即将开始
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
