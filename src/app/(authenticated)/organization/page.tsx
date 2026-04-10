import { getCurrentProfile } from "@/lib/auth";
import { OrganizationClientPage } from "@/features/organization/components/organization-client-page";
import { getPlanningData } from "@/lib/services/planning";

export default async function OrganizationPage() {
  const [profile, data] = await Promise.all([getCurrentProfile(), getPlanningData()]);

  return (
    <OrganizationClientPage
      initialData={data}
      isAdmin={profile?.appRole === "admin"}
    />
  );
}
