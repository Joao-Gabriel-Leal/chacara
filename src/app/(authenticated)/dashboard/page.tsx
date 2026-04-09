import Image from "next/image";
import {
  Banknote,
  BedDouble,
  Bell,
  Camera,
  Medal,
  Package2,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MotionFade } from "@/features/shared/components/motion-fade";
import { currentUser, dashboardSummary, recentEvents } from "@/lib/mock-data";

export default function DashboardPage() {
  const paymentProgress = (currentUser.amountPaid / currentUser.amountDue) * 100;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Dashboard individual"
        title={dashboardSummary.welcomeTitle}
        description={dashboardSummary.welcomeMessage}
        action={
          <Badge className="rounded-full bg-emerald-400/15 px-4 py-2 text-emerald-100">
            {currentUser.paymentStatus === "partial" ? "Pagamento parcial" : "Tudo em dia"}
          </Badge>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard
          icon={Banknote}
          label="Valor pago"
          value={`R$ ${currentUser.amountPaid}`}
          hint={`Faltam R$ ${currentUser.amountDue - currentUser.amountPaid}`}
        />
        <StatCard
          icon={Package2}
          label="Item para levar"
          value={currentUser.itemToBring}
          hint="Checklist individual do evento"
        />
        <StatCard
          icon={BedDouble}
          label="Quarto"
          value="Ninho da Logistica"
          hint="Com Vitor, Leandro e Erick"
        />
        <StatCard icon={Medal} label="Ranking" value="#3 geral" hint="A 45 pontos do topo" />
      </div>

      <div className="page-grid">
        <MotionFade>
          <section className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Status financeiro</p>
                  <h2 className="font-heading text-2xl font-semibold">Voce esta quase 100%</h2>
                </div>
                <Badge className="rounded-full bg-white text-black">
                  {paymentProgress.toFixed(0)}%
                </Badge>
              </div>
              <Progress className="mt-6 h-3 bg-white/10" value={paymentProgress} />
              <p className="mt-4 text-sm text-zinc-300">{dashboardSummary.highlightedNotice}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Bell className="size-5 text-emerald-200" />
                  <h3 className="font-heading text-xl font-semibold">Avisos recentes</h3>
                </div>
                <div className="space-y-3">
                  {recentEvents.map((event) => (
                    <div
                      key={event}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300"
                    >
                      {event}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Camera className="size-5 text-emerald-200" />
                  <h3 className="font-heading text-xl font-semibold">Fotos recentes</h3>
                </div>
                <div className="grid gap-3">
                  {dashboardSummary.recentPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
                    >
                      <Image
                        src={photo.url}
                        alt={photo.caption}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                      <div>
                        <p className="font-medium">{photo.caption}</p>
                        <p className="text-sm text-zinc-400">
                          {photo.author} • {photo.likesCount} curtidas
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </MotionFade>

        <MotionFade delay={0.1}>
          <section className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Avatar className="size-14 border border-white/10">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>JG</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-heading text-xl font-semibold">{currentUser.name}</p>
                  <p className="text-sm text-zinc-400">{currentUser.badge}</p>
                </div>
              </div>
              <p className="text-sm leading-7 text-zinc-300">{currentUser.bio}</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h3 className="font-heading text-xl font-semibold">Ranking dos jogos</h3>
              <div className="mt-4 space-y-3">
                {dashboardSummary.gameRanking.map((entry, index) => (
                  <div
                    key={entry.user}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">
                        #{index + 1} {entry.user}
                      </p>
                      <p className="text-sm text-zinc-400">{entry.streak}</p>
                    </div>
                    <Badge className="rounded-full bg-emerald-400/15 text-emerald-100">
                      {entry.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </MotionFade>
      </div>
    </div>
  );
}
