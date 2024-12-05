/**
 * Author: Libra
 * Date: 2024-12-03 09:41:21
 * LastEditors: Libra
 * Description:
 */
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const locales = [
  {
    value: "zh",
    label: "中文",
  },
  {
    value: "en",
    label: "English",
  },
] as const;

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocaleStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: "zh" | "en") => {
    startTransition(() => {
      setLocale(newLocale);
      const segments = pathname.split("/");
      const existingLocale = locales.find((l) => l.value === segments[1]);

      if (existingLocale) {
        // 如果路径中已有语言代码，替换它
        segments[1] = newLocale;
      } else {
        // 如果路径中没有语言代码，在开头添加
        segments.splice(1, 0, newLocale);
      }

      router.push(segments.join("/"));
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">切换语言</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map(({ value, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => handleLocaleChange(value)}
            className={locale === value ? "bg-accent" : ""}
            disabled={isPending}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
