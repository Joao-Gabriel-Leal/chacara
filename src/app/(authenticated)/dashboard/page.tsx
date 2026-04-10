import Image from "next/image";
import { Banknote, BedDouble, Bell, Camera, Medal, Package2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MotionFade } from "@/features/shared/components/motion-fade";
import { getCurrentProfile } from "@/lib/auth";
import { getDashboardData } from "@/lib/services/dashboard";
import { currentUser } from "@/lib/mock-data";
import { AppProfile } from "@/types/domain";

export default async function DashboardPage() {
  const profile =
    (await getCurrentProfile()) ??
    ({
      ...currentUser,
      roomName: null,
      email: undefined,
    } satisfies AppProfile);
  const { profile: hydratedProfile, summary, recentEvents } = await getDashboardData(profile);
  const paymentProgress =
    hydratedProfile.amountDue > 0
      ? (hydratedProfile.amountPaid / hydratedProfile.amountDue) * 100
      : 0;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Dashboard individual"
        title={summary.welcomeTitle}
        description={summary.welcomeMessage}
        action={
          <Badge className="rounded-full bg-emerald-400/15 px-4 py-2 text-emerald-100">
            {hydratedProfile.paymentStatus === "partial"
              ? "Pagamento parcial"
              : hydratedProfile.paymentStatus === "paid"
                ? "Tudo em dia"
                : "Pagamento pendente"}
          </Badge>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard
          icon={Banknote}
          label="Valor pago"
          value={`R$ ${hydratedProfile.amountPaid}`}
          hint={`Faltam R$ ${Math.max(hydratedProfile.amountDue - hydratedProfile.amountPaid, 0)}`}
        />
        <StatCard
          icon={Package2}
          label="Item para levar"
          value={hydratedProfile.itemToBring}
          hint="Checklist individual do evento"
        />
        <StatCard
          icon={BedDouble}
          label="Quarto"
          value={hydratedProfile.roomName ?? "A definir"}
          hint="Alocacao controlada pelo admin"
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
              <p className="mt-4 text-sm text-zinc-300">{summary.highlightedNotice}</p>
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
                  {summary.recentPhotos.map((photo) => (
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
                          {photo.author} - {photo.likesCount} curtidas
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
                  <AvatarImage src={hydratedProfile.avatar} alt={hydratedProfile.name} />
                  <AvatarFallback>JG</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-heading text-xl font-semibold">{hydratedProfile.name}</p>
                  <p className="text-sm text-zinc-400">{hydratedProfile.badge}</p>
                </div>
              </div>
              <p className="text-sm leading-7 text-zinc-300">{hydratedProfile.bio}</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h3 className="font-heading text-xl font-semibold">Ranking dos jogos</h3>
              <div className="mt-4 space-y-3">
                {summary.gameRanking.map((entry, index) => (
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
