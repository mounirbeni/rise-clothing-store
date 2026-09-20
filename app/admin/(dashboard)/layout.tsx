import { redirect } from "next/navigation";
import { getSession, isStaffRole } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || !isStaffRole(session.role)) {
    redirect("/admin/login");
  }

  return <AdminShell role={session.role} name={session.name}>{children}</AdminShell>;
}
