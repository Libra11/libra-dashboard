/**
 * Author: Libra
 * Date: 2024-12-18 16:02:00
 * LastEditors: Libra
 * Description:
 */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Moon, Sun, Palette, Languages } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ColorThemeSwitcher } from "@/components/color-theme-switcher";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme";

interface SettingsDialogProps {
  collapsed?: boolean;
}

export function SettingsDialog({ collapsed }: SettingsDialogProps) {
  const t = useTranslations();
  const { mode, colorTheme } = useThemeStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "flex items-center px-2 h-12 py-2 text-sm cursor-pointer rounded-2xl hover:bg-[hsl(var(--accent))]",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="h-9 w-9 bg-[hsl(var(--bg-icon))] rounded-xl flex justify-center items-center shrink-0">
            <Settings className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>
          <span
            className={cn(
              "transition-all duration-300",
              collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-2"
            )}
          >
            {t("common.settings")}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("common.settings")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* 主题设置 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                {mode === "light" ? (
                  <Sun className="h-5 w-5 text-[hsl(var(--primary))]" />
                ) : (
                  <Moon className="h-5 w-5 text-[hsl(var(--primary))]" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{t("common.theme")}</h3>
                <p className="text-sm text-muted-foreground">
                  选择明亮或暗黑模式
                </p>
              </div>
            </div>
            <ThemeSwitcher />
          </div>

          {/* 主题色设置 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                <Palette className="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h3 className="font-medium">{t("common.color")}</h3>
                <p className="text-sm text-muted-foreground">
                  选择你喜欢的主题色
                </p>
              </div>
            </div>
            <ColorThemeSwitcher />
          </div>

          {/* 语言设置 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-[hsl(var(--bg-icon))] flex items-center justify-center">
                <Languages className="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h3 className="font-medium">{t("common.language")}</h3>
                <p className="text-sm text-muted-foreground">选择界面语言</p>
              </div>
            </div>
            <LocaleSwitcher />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
