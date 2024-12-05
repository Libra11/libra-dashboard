/**
 * Author: Libra
 * Date: 2024-12-02 14:07:40
 * LastEditors: Libra
 * Description:
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {children}
    </div>
  );
}
