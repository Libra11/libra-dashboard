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
import { Settings } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ColorThemeSwitcher } from "@/components/color-theme-switcher";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
  collapsed?: boolean;
}

export function SettingsDialog({ collapsed }: SettingsDialogProps) {
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "flex items-center  px-2 h-12 py-2 text-sm cursor-pointer rounded-2xl hover:bg-[hsl(var(--accent))]",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("common.settings")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("common.theme")}</p>
            <ThemeSwitcher />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("common.color")}</p>
            <ColorThemeSwitcher />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("common.language")}</p>
            <LocaleSwitcher />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
