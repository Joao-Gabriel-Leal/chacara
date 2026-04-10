import { planningItems } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getPlanningData() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      items: planningItems,
      participants: [],
    };
  }

  const [{ data: items }, { data: profiles }] = await Promise.all([
    supabase.from("planning_items").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id,full_name").order("full_name"),
  ]);

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]));

  return {
    items:
      items?.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity ?? "",
        responsible: item.responsible_user_id ? profileMap.get(item.responsible_user_id) ?? "Nao definido" : "Nao definido",
        status: item.status,
        note: item.note ?? "",
      })) ?? planningItems,
    participants:
      profiles?.map((profile) => ({
        id: profile.id,
        name: profile.full_name,
      })) ?? [],
  };
}
