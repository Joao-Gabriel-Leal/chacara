import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppProfile, EventSettingsRecord, PaymentSummaryRecord } from "@/types/domain";

export async function getDashboardData(profile: AppProfile) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      profile,
      eventSettings: null,
      recentEvents: [
        "Conecte o Supabase para liberar o dashboard operacional.",
      ],
      summary: {
        welcomeTitle: `Bem-vindo de volta, ${profile.nickname}`,
        welcomeMessage: "Seu painel individual aparece aqui assim que o banco estiver conectado.",
        highlightedNotice: profile.roomName
          ? `Seu quarto atual e ${profile.roomName}.`
          : "Seu quarto ainda nao foi definido pelo admin.",
        recentPhotos: [],
        activePolls: [],
        gameRanking: [],
      },
    };
  }

  const [
    { data: paymentSummary },
    { data: settings },
    { data: photos },
    { data: activePolls },
    { data: scoreEvents },
    { data: profiles },
    { data: recentPosts },
  ] = await Promise.all([
    supabase
      .from("payment_summary")
      .select("*")
      .eq("user_id", profile.id)
      .maybeSingle<PaymentSummaryRecord>(),
    supabase.from("event_settings").select("*").limit(1).maybeSingle<EventSettingsRecord>(),
    supabase
      .from("gallery_items")
      .select("id,user_id,url,external_url,category,likes_count,caption,is_featured,is_approved,source,created_at,profiles!gallery_items_user_id_fkey(full_name)")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("polls")
      .select("id,title,description,status,poll_options(id,label,poll_votes(count))")
      .eq("status", "active")
      .limit(3),
    supabase.from("game_score_events").select("user_id,points"),
    supabase.from("profiles").select("id,full_name"),
    supabase.from("posts").select("content,created_at").order("created_at", { ascending: false }).limit(3),
  ]);

  const profileMap = new Map((profiles ?? []).map((row) => [row.id, row.full_name]));
  const rankingMap = new Map<string, number>();
  (scoreEvents ?? []).forEach((row) => {
    rankingMap.set(row.user_id, (rankingMap.get(row.user_id) ?? 0) + row.points);
  });

  const realRanking = [...rankingMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([userId, points], index) => ({
      user: profileMap.get(userId) ?? "Convidado",
      points,
      streak: index === 0 ? "lider atual" : "pontuando no role",
    }));

  const enrichedProfile = {
    ...profile,
    amountPaid: Number(paymentSummary?.amount_paid ?? 0),
    amountDue: Number(paymentSummary?.amount_due ?? profile.amountDue ?? 0),
    paymentStatus: paymentSummary?.payment_status ?? "pending",
  } satisfies AppProfile;

  const recentEvents =
    recentPosts?.map((post) => post.content) ??
    ["Sem avisos recentes no mural ainda."];

  return {
    profile: enrichedProfile,
    eventSettings: settings,
    recentEvents,
    summary: {
      welcomeTitle: `Bem-vindo de volta, ${enrichedProfile.nickname}`,
      welcomeMessage:
        settings?.hero_subtitle ??
        "Seu painel junta o essencial do evento para voce resolver tudo pelo celular.",
      highlightedNotice: enrichedProfile.roomName
        ? `Seu quarto atual e ${enrichedProfile.roomName}.`
        : "Seu quarto ainda nao foi definido pelo admin.",
      recentPhotos:
        photos?.map((photo) => ({
          id: photo.id,
          userId: photo.user_id,
          url: photo.url ?? "",
          externalUrl: photo.external_url ?? undefined,
          category: photo.category,
          likesCount: photo.likes_count,
          createdAt: new Date(photo.created_at).toLocaleDateString("pt-BR"),
          isFeatured: photo.is_featured,
          isApproved: photo.is_approved,
          source: photo.source,
          caption: photo.caption ?? "Sem legenda",
          author: photo.profiles?.[0]?.full_name ?? "Convidado",
        })) ?? [],
      activePolls:
        activePolls?.map((poll) => ({
          id: poll.id,
          title: poll.title,
          description: poll.description ?? "",
          status: poll.status,
          totalVotes: poll.poll_options?.reduce((sum, option) => sum + (option.poll_votes?.[0]?.count ?? 0), 0) ?? 0,
          options:
            poll.poll_options?.map((option) => ({
              id: option.id,
              label: option.label,
              votes: option.poll_votes?.[0]?.count ?? 0,
            })) ?? [],
        })) ?? [],
      gameRanking: realRanking,
    },
  };
}
