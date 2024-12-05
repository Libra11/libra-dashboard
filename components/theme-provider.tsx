/**
 * Author: Libra
 * Date: 2024-12-02 16:35:31
 * LastEditors: Libra
 * Description: 
*/
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import { useThemeStore } from "@/store/theme";

function InitColorTheme() {
  const { colorTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorTheme);
  }, [colorTheme]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <InitColorTheme />
      {children}
    </NextThemesProvider>
  );
}
