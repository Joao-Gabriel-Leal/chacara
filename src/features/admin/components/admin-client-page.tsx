"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ImageUp, ShieldCheck, UserPlus, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";
import { getAdminData } from "@/lib/services/admin";

type AdminData = Awaited<ReturnType<typeof getAdminData>>;

export function AdminClientPage({ initialData }: { initialData: AdminData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function updatePayment(id: string, status: "paid" | "partial" | "pending") {
    const supabase = createClient();

    if (!supabase) {
      toast.error("Supabase indisponivel.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("payment_submissions")
      .update({
        status,
        approved_by: user?.id ?? null,
        approved_at: status === "pending" ? null : new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Pagamento atualizado.");
    startTransition(() => router.refresh());
  }

  async function moderatePhoto(id: string, isApproved: boolean) {
    const supabase = createClient();

    if (!supabase) {
      toast.error("Supabase indisponivel.");
      return;
    }

    const { error } = await supabase
      .from("gallery_items")
      .update({ is_approved: isApproved, is_featured: isApproved })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(isApproved ? "Foto aprovada." : "Foto removida da fila.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Painel admin"
        title="Operacao completa do evento"
        description="Usuarios, pagamentos, curadoria de fotos e metricas reais do Supabase em um unico painel."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {initialData.metrics.map((metric, index) => {
          const icons = [UsersRound, CreditCard, ImageUp, UserPlus] as const;
          const Icon = icons[index];
          return (
            <StatCard
              key={metric.label}
              icon={Icon}
              label={metric.label}
              value={metric.value}
              hint={metric.hint}
            />
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold">Fila de aprovacao</h2>
              <p className="text-sm text-zinc-400">Comprovantes com acao real de aprovar, parcial ou devolver para pendente.</p>
            </div>
            <ShieldCheck className="size-5 text-emerald-200" />
          </div>
          <div className="space-y-3">
            {initialData.pendingPayments.length > 0 ? initialData.pendingPayments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{payment.userName}</p>
                    <p className="text-sm text-zinc-400">{payment.createdAt}</p>
                    {payment.note ? <p className="mt-2 text-sm text-zinc-300">{payment.note}</p> : null}
                    {payment.proofPath ? (
                      <p className="mt-2 break-all text-xs text-zinc-500">{payment.proofPath}</p>
                    ) : null}
                  </div>
                  <Badge className="rounded-full bg-white/10 capitalize text-white">
                    R$ {payment.amount}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    className="rounded-full bg-emerald-400 text-black hover:bg-emerald-300"
                    onClick={() => updatePayment(payment.id, "paid")}
                    disabled={isPending}
                  >
                    Aprovar total
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/5"
                    onClick={() => updatePayment(payment.id, "partial")}
                    disabled={isPending}
                  >
                    Marcar parcial
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-full text-zinc-300 hover:bg-white/10"
                    onClick={() => updatePayment(payment.id, "pending")}
                    disabled={isPending}
                  >
                    Deixar pendente
                  </Button>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-sm text-zinc-400">
                Nenhum comprovante pendente agora.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold">Curadoria de fotos</h2>
              <p className="text-sm text-zinc-400">Aprove ou segure fotos sugeridas para destaque na galeria principal.</p>
            </div>
            <ImageUp className="size-5 text-emerald-200" />
          </div>
          <div className="space-y-3">
            {initialData.pendingPhotos.length > 0 ? initialData.pendingPhotos.map((photo) => (
              <div key={photo.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{photo.caption}</p>
                    <p className="text-sm text-zinc-400">
                      {photo.userName} - {photo.category} - {photo.source}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">{photo.createdAt}</p>
                  </div>
                  <Badge className="rounded-full bg-white/10 capitalize text-white">
                    curadoria
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    className="rounded-full bg-emerald-400 text-black hover:bg-emerald-300"
                    onClick={() => moderatePhoto(photo.id, true)}
                    disabled={isPending}
                  >
                    Aprovar
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/5"
                    onClick={() => moderatePhoto(photo.id, false)}
                    disabled={isPending}
                  >
                    Manter fora da galeria
                  </Button>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-sm text-zinc-400">
                Nenhuma foto aguardando curadoria.
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Usuarios e operacao</h2>
            <p className="text-sm text-zinc-400">Visao real dos perfis ja cadastrados no evento.</p>
          </div>
          <UsersRound className="size-5 text-emerald-200" />
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {initialData.users.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-zinc-400">
                    {user.roleInEvent} - {user.eventStatus}
                  </p>
                </div>
                <Badge className="rounded-full bg-white/10 capitalize text-white">
                  {user.appRole}
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-zinc-300">
                <span>{user.badge}</span>
                <span>R$ {user.amountDue}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
