"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface LogoutDialogProps {
  collapsed?: boolean;
}

export function LogoutDialog({ collapsed }: LogoutDialogProps) {
  const t = useTranslations();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div
          className={cn(
            "flex items-center px-2 h-12 py-2 text-sm cursor-pointer rounded-2xl hover:bg-[hsl(var(--accent))]",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="h-9 w-9 bg-[hsl(var(--bg-icon))] rounded-xl flex justify-center items-center shrink-0">
            <LogOut className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>
          <span
            className={cn(
              "transition-all duration-300",
              collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-2"
            )}
          >
            {t("common.logout")}
          </span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("common.logout")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("common.logoutConfirm")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => signOut()}>
            {t("common.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
