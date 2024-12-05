/*
 * @Author: Libra
 * @Date: 2024-11-29 17:10:40
 * @LastEditors: Libra
 * @Description:
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as Icons from "lucide-react";
import { LucideIcon, LucideProps } from "lucide-react";
import { ComponentType } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIcon(iconName: string): ComponentType {
  const Icon = Icons[iconName as keyof typeof Icons];
  if (typeof Icon === "function") {
    return Icon as ComponentType;
  }
  return Icons.Circle;
}

export function getLocalizedUrl(path: string, locale?: string) {
  if (!locale) {
    return path;
  }
  return `/${locale}${path}`;
}
