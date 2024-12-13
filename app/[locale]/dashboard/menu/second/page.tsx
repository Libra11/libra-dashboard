/**
 * Author: Libra
 * Date: 2024-12-05 18:20:25
 * LastEditors: Libra
 * Description:
 */
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";

export default function SecondPage() {
  const router = useRouter();

  const goToIdPage = (id: string) => {
    router.push(`/dashboard/menu/${id}`);
  };

  const { hasPermission } = usePermissions();

  const hasTestPermission = hasPermission("test_permission");

  return (
    <div>
      {hasTestPermission && <Button>拥有test_permission权限可以看到</Button>}
      <Button className="ml-4">所有人都能看到</Button>
      <Button className="ml-4" onClick={() => goToIdPage("1")}>
        Go to ID Page
      </Button>
    </div>
  );
}
