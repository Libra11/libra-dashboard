"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/theme";
import { useTranslations } from "next-intl";

export function ThemeSwitcher() {
  const { mode: _, setMode } = useThemeStore();
  const t = useTranslations("theme.switcher");

  // 监听主题变化
  const mode = JSON.parse(localStorage.getItem("theme-storage") || "{}")?.state
    .mode;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
      title={t(`mode.${mode}`)}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t("label")}</span>
    </Button>
  );
}
