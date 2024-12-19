/**
 * Author: Libra
 * Date: 2024-12-19 10:36:36
 * LastEditors: Libra
 * Description:
 */
"use client";

import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  text?: string;
}

export function Loading({ className, text }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] items-center justify-center",
        className
      )}
    >
      <div className="relative flex flex-col items-center">
        <div className="relative h-24 w-24">
          {/* 外圈动画 */}
          <div className="absolute inset-0">
            <div className="h-24 w-24 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-[spin_1s_linear_infinite] opacity-10" />
          </div>
          {/* 中圈动画 */}
          <div className="absolute inset-0">
            <div className="h-24 w-24 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-[spin_0.8s_linear_infinite] opacity-20" />
          </div>
          {/* 内圈动画 */}
          <div className="absolute inset-0">
            <div className="h-24 w-24 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-[spin_0.6s_linear_infinite] opacity-30" />
          </div>
        </div>
        {/* 加载文字 */}
        {text && (
          <span className="mt-4 text-base text-muted-foreground/50">
            {text}
          </span>
        )}
      </div>
    </div>
  );
}
