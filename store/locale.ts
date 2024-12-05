/*
 * @Author: Libra
 * @Date: 2024-12-02 17:42:51
 * @LastEditors: Libra
 * @Description: 语言设置
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Locale = "zh" | "en";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "zh",
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: "locale-storage",
    }
  )
);
