import { createServerSupabaseClient } from "@/lib/supabase/server";
import { appEnv } from "@/lib/env";

export async function getLandingData() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      event: {
        name: "Chacara Hub",
        tagline: "Fim de semana premium entre amigos, com caos organizado.",
        location: appEnv.eventLocation,
        total_cost: 0,
        amount_per_person: 0,
        event_date: appEnv.eventDate,
      },
      participantsCount: 0,
      avatars: [],
    };
  }

  const [{ data: event }, { count }, { data: profiles }] = await Promise.all([
    supabase.from("event_settings").select("*").limit(1).maybeSingle(),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("id,full_name,nickname,avatar_url").order("created_at").limit(5),
  ]);

  return {
    event: event ?? {
      name: "Chacara Hub",
      tagline: "Fim de semana premium entre amigos, com caos organizado.",
      location: appEnv.eventLocation,
      total_cost: 0,
      amount_per_person: 0,
      event_date: appEnv.eventDate,
    },
    participantsCount: count ?? 0,
    avatars:
      profiles?.map((profile) => ({
        id: profile.id,
        name: profile.full_name,
        nickname: profile.nickname,
        avatar:
          profile.avatar_url ??
          `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(profile.full_name)}`,
      })) ?? [],
  };
}
