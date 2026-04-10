import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppProfile } from "@/types/domain";

export async function getServerSession() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { supabase: null, session: null, user: null };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { supabase, session, user: session?.user ?? null };
}

export async function getCurrentProfile() {
  const { supabase, user } = await getServerSession();

  if (!supabase || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, rooms(name)")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    name: profile.full_name,
    nickname: profile.nickname,
    avatar: profile.avatar_url ?? `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(profile.full_name)}`,
    bio: profile.bio ?? "",
    eventStatus: profile.event_status,
    roleInEvent: profile.role_in_event ?? "participante",
    badge: profile.special_badge ?? "Guest",
    roomId: profile.room_id ?? undefined,
    roomName: profile.rooms?.name ?? null,
    itemToBring: profile.item_to_bring ?? "Nada definido",
    amountPaid: 0,
    amountDue: Number(profile.amount_due ?? 0),
    paymentStatus: "pending",
    appRole: profile.app_role,
    email: user.email,
  } satisfies AppProfile;
}

export async function requireAuthenticatedUser() {
  const sessionState = await getServerSession();

  if (!sessionState.user) {
    redirect("/login");
  }

  return sessionState;
}

export async function requireAdminUser() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.appRole !== "admin") {
    redirect("/dashboard");
  }

  return profile;
}
