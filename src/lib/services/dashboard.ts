import { currentUser, dashboardSummary, galleryItems, gameRanking, polls, recentEvents } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppProfile, EventSettingsRecord, PaymentSummaryRecord } from "@/types/domain";

const mockProfile: AppProfile = {
  ...currentUser,
  roomName: null,
  email: undefined,
};

export async function getDashboardData(profile: AppProfile) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      profile: mockProfile,
      eventSettings: null,
      summary: dashboardSummary,
      recentEvents,
    };
  }

  const [{ data: paymentSummary }, { data: settings }, { data: photos }, { data: activePolls }, { data: scoreEvents }, { data: profiles }] =
    await Promise.all([
      supabase
        .from("payment_summary")
        .select("*")
        .eq("user_id", profile.id)
        .maybeSingle<PaymentSummaryRecord>(),
      supabase.from("event_settings").select("*").limit(1).maybeSingle<EventSettingsRecord>(),
      supabase
        .from("gallery_items")
        .select("id,user_id,url,external_url,category,likes_count,caption,is_featured,is_approved,source,created_at")
        .eq("is_approved", true)
        .order("likes_count", { ascending: false })
        .limit(3),
      supabase.from("polls").select("id,title,description,status").eq("status", "active").limit(3),
      supabase.from("game_score_events").select("user_id,points"),
      supabase.from("profiles").select("id,full_name"),
    ]);

  const profileMap = new Map((profiles ?? []).map((row) => [row.id, row.full_name]));
  const rankingMap = new Map<string, number>();
  (scoreEvents ?? []).forEach((row) => {
    rankingMap.set(row.user_id, (rankingMap.get(row.user_id) ?? 0) + row.points);
  });
  const realRanking = [...rankingMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([userId, points]) => ({
      user: profileMap.get(userId) ?? "Convidado",
      points,
      streak: "pontuacao real",
    }));

  const enrichedProfile = {
    ...profile,
    amountPaid: Number(paymentSummary?.amount_paid ?? 0),
    amountDue: Number(paymentSummary?.amount_due ?? profile.amountDue ?? 0),
    paymentStatus: paymentSummary?.payment_status ?? "pending",
  } satisfies AppProfile;

  return {
    profile: enrichedProfile,
    eventSettings: settings,
    recentEvents,
    summary: {
      welcomeTitle: `Bem-vindo de volta, ${enrichedProfile.nickname}`,
      welcomeMessage:
        "Seu painel junta tudo o que voce precisa para chegar no evento sem perder nada do caos organizado.",
      highlightedNotice: enrichedProfile.roomName
        ? `Seu quarto atual e ${enrichedProfile.roomName}.`
        : "Seu quarto ainda nao foi definido pelo admin.",
      recentPhotos:
        photos?.map((photo, index) => ({
          id: photo.id,
          userId: photo.user_id,
          url: photo.url ?? galleryItems[index % galleryItems.length].url,
          externalUrl: photo.external_url ?? undefined,
          category: photo.category,
          likesCount: photo.likes_count,
          createdAt: new Date(photo.created_at).toLocaleDateString("pt-BR"),
          isFeatured: photo.is_featured,
          isApproved: photo.is_approved,
          source: photo.source,
          caption: photo.caption ?? "Sem legenda",
          author: "Convidado",
        })) ?? dashboardSummary.recentPhotos,
      activePolls:
        activePolls?.map((poll) => ({
          id: poll.id,
          title: poll.title,
          description: poll.description ?? "",
          status: poll.status,
          totalVotes: 0,
          options: [],
        })) ?? polls,
      gameRanking: realRanking.length > 0 ? realRanking : gameRanking,
    },
  };
}
