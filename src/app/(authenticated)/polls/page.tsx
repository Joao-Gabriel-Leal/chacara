import { getCurrentProfile } from "@/lib/auth";
import { PollsClientPage } from "@/features/polls/components/polls-client-page";
import { getPollsData } from "@/lib/services/polls";

export default async function PollsPage() {
  const profile = await getCurrentProfile();
  const data = await getPollsData(profile?.id);

  return (
    <PollsClientPage
      initialData={data}
      currentUserId={profile?.id}
      isAdmin={profile?.appRole === "admin"}
    />
  );
}
