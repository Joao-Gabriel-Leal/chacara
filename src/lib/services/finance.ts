import { paymentHistory, profiles } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getFinanceData(currentUserId?: string) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      participants: profiles,
      paymentHistory,
      eventSettings: null,
      currentSummary: null,
    };
  }

  const [{ data: settings }, { data: participants }, { data: submissions }, { data: currentSummary }] =
    await Promise.all([
      supabase.from("event_settings").select("*").limit(1).maybeSingle(),
      supabase.from("payment_summary").select("*").order("full_name"),
      supabase
        .from("payment_submissions")
        .select("id,user_id,amount,status,proof_path,note,created_at,profiles!payment_submissions_user_id_fkey(full_name)")
        .order("created_at", { ascending: false })
        .limit(12),
      currentUserId
        ? supabase.from("payment_summary").select("*").eq("user_id", currentUserId).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  return {
    eventSettings: settings,
    currentSummary,
    participants:
      participants?.map((entry) => ({
        id: entry.user_id,
        name: entry.full_name,
        nickname: entry.full_name.split(" ")[0],
        avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(entry.full_name)}`,
        bio: "",
        eventStatus: "confirmed" as const,
        roleInEvent: "participante",
        badge: "Guest",
        itemToBring: "Nada definido",
        amountPaid: Number(entry.amount_paid),
        amountDue: Number(entry.amount_due),
        paymentStatus: entry.payment_status,
        appRole: "member" as const,
      })) ?? profiles,
    paymentHistory:
      submissions?.map((item) => ({
        id: item.id,
        user: item.profiles?.[0]?.full_name ?? "Participante",
        amount: Number(item.amount),
        status: item.status,
        submittedAt: new Date(item.created_at).toLocaleDateString("pt-BR"),
        proofLabel: item.proof_path ?? "Sem anexo",
      })) ?? paymentHistory,
  };
}
