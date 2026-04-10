import { getCurrentProfile } from "@/lib/auth";
import { RoomsClientPage } from "@/features/rooms/components/rooms-client-page";
import { getRoomsData } from "@/lib/services/rooms";

export default async function RoomsPage() {
  const [profile, data] = await Promise.all([getCurrentProfile(), getRoomsData()]);

  return <RoomsClientPage initialData={data} isAdmin={profile?.appRole === "admin"} />;
}
