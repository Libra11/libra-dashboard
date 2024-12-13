/*
 * @Author: Libra
 * @Date: 2024-12-02 17:42:51
 * @LastEditors: Libra
 * @Description: 主题管理
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Mode = "light" | "dark";

const DEFAULT_COLOR_THEME = "blue";

interface ThemeState {
  colorTheme: string;
  setColorTheme: (theme: string) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorTheme: DEFAULT_COLOR_THEME,
      setColorTheme: (theme: string) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ colorTheme: theme });
      },
      mode: "light" as const,
      setMode: (mode: Mode) => {
        console.log("setMode", mode);
        document.documentElement.classList.toggle("dark", mode === "dark");
        set({ mode });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated state:", state);
      },
    }
  )
);
