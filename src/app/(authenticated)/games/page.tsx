import { getCurrentProfile } from "@/lib/auth";
import { getGamesData } from "@/lib/services/games";
import { GamesClientPage } from "@/features/games/components/games-client-page";

export default async function GamesPage() {
  const [profile, initialData] = await Promise.all([getCurrentProfile(), getGamesData()]);

  return <GamesClientPage initialData={initialData} currentUserId={profile?.id} />;
}
