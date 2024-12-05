"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/theme";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export function ThemeSwitcher() {
  const { mode, setMode } = useThemeStore();
  const t = useTranslations("theme.switcher");

  // 初始化时同步系统主题
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (mode === "system") {
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

  // 监听主题变化
  useEffect(() => {
    const isDark =
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, [mode]);

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
