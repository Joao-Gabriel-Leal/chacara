import { Search, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PaymentProofForm } from "@/features/finance/components/payment-proof-form";
import { getCurrentProfile } from "@/lib/auth";
import { getFinanceData } from "@/lib/services/finance";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currentUser, eventSettings } from "@/lib/mock-data";

export default async function FinancePage() {
  const profile = await getCurrentProfile();
  const { participants, paymentHistory, eventSettings: liveSettings, currentSummary } =
    await getFinanceData(profile?.id);
  const settings = liveSettings ?? eventSettings;
  const totalCollected = participants.reduce((sum, participant) => sum + participant.amountPaid, 0);
  const progress = settings.total_cost
    ? (totalCollected / Number(settings.total_cost)) * 100
    : (totalCollected / eventSettings.totalCost) * 100;
  const currentPayment = currentSummary ?? {
    payment_status: profile?.paymentStatus ?? currentUser.paymentStatus,
    amount_paid: profile?.amountPaid ?? currentUser.amountPaid,
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Financeiro"
        title="Controle financeiro do evento"
        description="Visao individual e operacional: quanto entrou, quem esta pendente e quais comprovantes precisam de aprovacao."
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Valor total da chacara", `R$ ${Number(settings.total_cost ?? eventSettings.totalCost)}`, "Custos totais do evento"],
              ["Valor por pessoa", `R$ ${Number(settings.amount_per_person ?? eventSettings.amountPerPerson)}`, "Meta individual"],
              ["Seu status", currentPayment.payment_status, `Pago R$ ${Number(currentPayment.amount_paid)}`],
            ].map(([label, value, hint]) => (
              <div key={label} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-zinc-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold capitalize">{value}</p>
                <p className="mt-2 text-sm text-zinc-300">{hint}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Barra de arrecadacao</p>
                <h2 className="font-heading text-2xl font-semibold">R$ {totalCollected} arrecadados</h2>
              </div>
              <Badge className="rounded-full bg-emerald-400/15 text-emerald-100">
                {progress.toFixed(0)}% da meta
              </Badge>
            </div>
            <Progress value={progress} className="mt-6 h-3 bg-white/10" />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold">Participantes e status</h2>
                <p className="text-sm text-zinc-400">Busca e filtros prontos para evoluir com TanStack Query.</p>
              </div>
              <div className="relative w-full max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <Input className="pl-9" placeholder="Buscar por nome ou status" />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Pendente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.slice(0, 8).map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell className="capitalize">{participant.paymentStatus}</TableCell>
                    <TableCell>R$ {participant.amountPaid}</TableCell>
                    <TableCell>R$ {participant.amountDue - participant.amountPaid}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center gap-3">
              <WalletCards className="size-5 text-emerald-200" />
              <h2 className="font-heading text-2xl font-semibold">Enviar comprovante</h2>
            </div>
            <PaymentProofForm />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="font-heading text-2xl font-semibold">Historico recente</h2>
            <div className="mt-4 space-y-3">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{payment.user}</p>
                      <p className="text-sm text-zinc-400">
                        {payment.submittedAt} • {payment.proofLabel}
                      </p>
                    </div>
                    <Badge className="rounded-full bg-white/10 capitalize text-white">
                      {payment.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-lg font-semibold">R$ {payment.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
