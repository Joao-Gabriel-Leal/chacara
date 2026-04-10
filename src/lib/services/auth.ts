import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function syncProfileFromSignup(params: {
  userId: string;
  email: string;
  fullName: string;
}) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { error: null };
  }

  const nickname = params.fullName.split(" ")[0] ?? params.fullName;

  return supabase.from("profiles").upsert({
    id: params.userId,
    full_name: params.fullName,
    nickname,
    bio: "Novo participante do Chacara Hub.",
    event_status: "confirmed",
    role_in_event: "participante",
    special_badge: "Guest",
    app_role: "member",
    amount_due: 240,
    item_to_bring: "Nada definido",
  });
}
