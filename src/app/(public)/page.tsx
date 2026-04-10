import Link from "next/link";
import { differenceInDays, differenceInHours } from "date-fns";
import {
  ArrowRight,
  CalendarRange,
  CreditCard,
  Images,
  Sparkles,
  Users,
} from "lucide-react";
import { MotionFade } from "@/features/shared/components/motion-fade";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { appEnv } from "@/lib/env";
import { getLandingData } from "@/lib/services/public";

export default async function LandingPage() {
  const landingData = await getLandingData();
  const startsAt = new Date(landingData.event.event_date || appEnv.eventDate);
  const daysLeft = differenceInDays(startsAt, new Date());
  const hoursLeft = differenceInHours(startsAt, new Date()) % 24;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 md:px-6">
      <header className="flex items-center justify-between rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
        <div>
          <p className="font-heading text-xl font-semibold">Chacara Hub</p>
          <p className="text-sm text-zinc-400">Evento social com cara de produto real</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="rounded-full text-white hover:bg-white/10">
            <Link href="/register">Ativar convite</Link>
          </Button>
          <Button asChild className="rounded-full bg-white text-black hover:bg-zinc-200">
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </header>

      <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <MotionFade>
          <div className="space-y-6">
            <Badge className="rounded-full border border-emerald-300/20 bg-emerald-400/15 px-4 py-2 text-emerald-100">
              Countdown oficial do role
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-heading text-5xl font-semibold tracking-tight text-white md:text-7xl">
                O hub premium da nossa chacara.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                Financeiro, quartos, mural, fotos, enquetes e jogos em uma interface feita para parecer um produto de verdade.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Dias", value: String(daysLeft).padStart(2, "0") },
                { label: "Horas", value: String(hoursLeft).padStart(2, "0") },
                { label: "Convidados", value: `${landingData.participantsCount}` },
              ].map((item) => (
                <div key={item.label} className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <p className="text-sm text-zinc-400">{item.label}</p>
                  <p className="mt-2 font-heading text-4xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-emerald-400 px-6 text-black hover:bg-emerald-300"
              >
                <Link href="/dashboard">
                  Ver dashboard demo
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/15 bg-white/5"
              >
                <Link href="/register">Cadastrar com convite</Link>
              </Button>
            </div>
          </div>
        </MotionFade>

        <MotionFade delay={0.1}>
          <div className="rounded-[36px] border border-white/10 bg-black/35 p-5 shadow-[0_50px_120px_-50px_rgba(16,185,129,0.45)] backdrop-blur-2xl">
            <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-emerald-100/70">
                    Evento
                  </p>
                  <h2 className="mt-2 font-heading text-3xl font-semibold">
                    {landingData.event.name}
                  </h2>
                </div>
                <Sparkles className="size-8 text-emerald-200" />
              </div>
              <p className="mt-3 max-w-md text-sm text-zinc-200">{landingData.event.tagline}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: CalendarRange, label: "Data", value: "12 Dez 2026" },
                  { icon: CreditCard, label: "Cota", value: `R$ ${Number(landingData.event.amount_per_person ?? 0)} por pessoa` },
                  { icon: Images, label: "Galeria", value: "Album + app + curadoria" },
                  { icon: Users, label: "Grupo", value: `${landingData.participantsCount} pessoas confirmadas` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-[24px] border border-white/10 bg-black/25 p-4">
                    <Icon className="mb-3 size-5 text-emerald-200" />
                    <p className="text-sm text-zinc-400">{label}</p>
                    <p className="mt-1 font-medium text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {landingData.avatars.map((profile) => (
                    <Avatar key={profile.id} className="size-11 border-2 border-black/40">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback>{profile.nickname.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-sm text-zinc-300">{landingData.event.location}</p>
              </div>
            </div>
          </div>
        </MotionFade>
      </section>
    </main>
  );
}
