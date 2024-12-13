/**
 * Author: Libra
 * Date: 2024-11-29 17:10:47
 * LastEditors: Libra
 * Description:
 */
import { AppSidebar } from "@/app/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PermissionGuard from "@/components/auth/permission-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen p-8">
        <div className="rounded-3xl flex bg-red-300 w-full h-full">
          <div className="w-[16rem]">
            <AppSidebar />
          </div>
          <main className="flex-1 overflow-auto p-8">
            <SidebarTrigger />
            <PermissionGuard>{children}</PermissionGuard>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
