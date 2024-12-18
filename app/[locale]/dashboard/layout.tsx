/**
 * Author: Libra
 * Date: 2024-11-29 17:10:47
 * LastEditors: Libra
 * Description:
 */
import { AppSidebar } from "@/app/components/sidebar";
import PermissionGuard from "@/components/auth/permission-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen p-4 bg-[hsl(var(--bg-color))]">
      <div className="rounded-3xl flex gap-6 bg-gradient-to-b from-[hsl(var(--bg-inner-color2))] from-80% to-[hsl(var(--bg-inner-color1))] w-full h-full p-4">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-6">
          <PermissionGuard>{children}</PermissionGuard>
        </main>
      </div>
    </div>
  );
}
