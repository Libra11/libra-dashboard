import { useSession } from "next-auth/react";

export function usePermissions() {
  const { data: session } = useSession();
  const permissions = session?.user?.role?.permissions || [];

  const hasPermission = (code: string) => {
    return permissions.some((p) => p.code === code);
  };

  const hasPermissions = (requiredCodes: string[]) => {
    return requiredCodes.every((code) =>
      permissions.some((p) => p.code === code)
    );
  };

  const hasAnyPermission = (requiredCodes: string[]) => {
    return requiredCodes.some((code) =>
      permissions.some((p) => p.code === code)
    );
  };

  return {
    permissions,
    hasPermission,
    hasPermissions,
    hasAnyPermission,
  };
}
