import { getCurrentProfile } from "@/lib/auth";
import { FeedClientPage } from "@/features/feed/components/feed-client-page";
import { getFeedData } from "@/lib/services/feed";

export default async function FeedPage() {
  const profile = await getCurrentProfile();
  const data = await getFeedData();

  return (
    <FeedClientPage
      initialData={data}
      currentUserId={profile?.id}
      isAdmin={profile?.appRole === "admin"}
    />
  );
}
