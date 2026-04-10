import { BarChart, CreditCard, ShieldCheck, UserPlus, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { requireAdminUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminMetrics, paymentHistory, profiles } from "@/lib/mock-data";

export default async function AdminPage() {
  await requireAdminUser();

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Painel admin"
        title="Operacao completa do evento"
        description="Usuarios, convites, pagamentos, quartos, fotos, tarefas, enquetes e metricas em um unico painel."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {adminMetrics.metrics.map((metric, index) => {
          const icons = [BarChart, CreditCard, UserPlus, UsersRound] as const;
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
              <p className="text-sm text-zinc-400">Comprovantes aguardando acao manual do admin.</p>
            </div>
            <ShieldCheck className="size-5 text-emerald-200" />
          </div>
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{payment.user}</p>
                    <p className="text-sm text-zinc-400">{payment.proofLabel}</p>
                  </div>
                  <Badge className="rounded-full bg-white/10 capitalize text-white">
                    {payment.status}
                  </Badge>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button className="rounded-full bg-emerald-400 text-black hover:bg-emerald-300">
                    Aprovar
                  </Button>
                  <Button variant="outline" className="rounded-full border-white/10 bg-white/5">
                    Recusar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold">Usuarios e convites</h2>
              <p className="text-sm text-zinc-400">Perfis iniciais do seed e status de operacao.</p>
            </div>
            <UsersRound className="size-5 text-emerald-200" />
          </div>
          <div className="space-y-3">
            {profiles.slice(0, 8).map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-zinc-400">
                    {profile.roleInEvent} - {profile.paymentStatus}
                  </p>
                </div>
                <Button variant="outline" className="rounded-full border-white/10 bg-white/5">
                  Editar
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
