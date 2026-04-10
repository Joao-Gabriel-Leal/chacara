import { AdminClientPage } from "@/features/admin/components/admin-client-page";
import { requireAdminUser } from "@/lib/auth";
import { getAdminData } from "@/lib/services/admin";

export default async function AdminPage() {
  await requireAdminUser();
  const adminData = await getAdminData();

  return <AdminClientPage initialData={adminData} />;
}
