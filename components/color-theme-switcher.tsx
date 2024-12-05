"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { useTranslations } from "next-intl";

const colorThemes = [
  {
    value: "blue",
    color: "hsl(221.2 83.2% 53.3%)",
  },
  {
    value: "green",
    color: "hsl(142.1 76.2% 36.3%)",
  },
  {
    value: "violet",
    color: "hsl(262.1 83.3% 57.8%)",
  },
  {
    value: "rose",
    color: "hsl(346.8 77.2% 49.8%)",
  },
  {
    value: "orange",
    color: "hsl(24.6 95% 53.1%)",
  },
] as const;

export function ColorThemeSwitcher() {
  const { colorTheme, setColorTheme, mode } = useThemeStore();
  const t = useTranslations("theme.switcher.color");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("label")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
        {colorThemes.map(({ value, color }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setColorTheme(value)}
            className={colorTheme === value ? "bg-accent" : ""}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{
                  backgroundColor: color,
                  filter: mode === "dark" ? "brightness(1.2)" : "none",
                }}
              />
              {t(value)}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
