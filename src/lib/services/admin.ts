import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminData() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      metrics: [
        { label: "Participantes", value: "0", hint: "Sem conexao com o banco" },
        { label: "Pendencias", value: "0", hint: "Sem comprovantes pendentes" },
        { label: "Fotos pendentes", value: "0", hint: "Sem curadoria ativa" },
        { label: "Enquetes ativas", value: "0", hint: "Sem enquetes abertas" },
      ],
      pendingPayments: [],
      users: [],
      pendingPhotos: [],
    };
  }

  const [
    { count: profilesCount },
    { count: pendingPaymentsCount },
    { count: pendingPhotosCount },
    { count: activePollsCount },
    { data: pendingPayments },
    { data: userRows },
    { data: pendingPhotos },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("payment_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("gallery_items")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", false),
    supabase.from("polls").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("payment_submissions")
      .select("id,user_id,amount,status,proof_path,note,created_at,profiles!payment_submissions_user_id_fkey(full_name)")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("profiles")
      .select("id,full_name,nickname,event_status,role_in_event,special_badge,app_role,amount_due")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("gallery_items")
      .select("id,user_id,caption,category,source,created_at,profiles!gallery_items_user_id_fkey(full_name)")
      .eq("is_approved", false)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return {
    metrics: [
      {
        label: "Participantes",
        value: String(profilesCount ?? 0),
        hint: "Perfis ativos no evento",
      },
      {
        label: "Pendencias",
        value: String(pendingPaymentsCount ?? 0),
        hint: "Comprovantes aguardando admin",
      },
      {
        label: "Fotos pendentes",
        value: String(pendingPhotosCount ?? 0),
        hint: "Itens em curadoria",
      },
      {
        label: "Enquetes ativas",
        value: String(activePollsCount ?? 0),
        hint: "Votacoes abertas agora",
      },
    ],
    pendingPayments:
      pendingPayments?.map((payment) => ({
        id: payment.id,
        userId: payment.user_id,
        userName: payment.profiles?.[0]?.full_name ?? "Participante",
        amount: Number(payment.amount),
        status: payment.status,
        note: payment.note ?? "",
        proofPath: payment.proof_path ?? "",
        createdAt: new Date(payment.created_at).toLocaleString("pt-BR"),
      })) ?? [],
    users:
      userRows?.map((user) => ({
        id: user.id,
        fullName: user.full_name,
        nickname: user.nickname,
        eventStatus: user.event_status,
        roleInEvent: user.role_in_event ?? "participante",
        badge: user.special_badge ?? "Guest",
        appRole: user.app_role,
        amountDue: Number(user.amount_due ?? 0),
      })) ?? [],
    pendingPhotos:
      pendingPhotos?.map((photo) => ({
        id: photo.id,
        caption: photo.caption ?? "Sem legenda",
        category: photo.category,
        source: photo.source,
        userName: photo.profiles?.[0]?.full_name ?? "Participante",
        createdAt: new Date(photo.created_at).toLocaleString("pt-BR"),
      })) ?? [],
  };
}
