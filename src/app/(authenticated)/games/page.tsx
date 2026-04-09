import { Crown, Zap } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gameCards, gameRanking } from "@/lib/mock-data";

export default function GamesPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Jogos"
        title="Competicao com ranking unificado"
        description="Quatro jogos v1 preparados em cima de um motor comum de pontuacao, ranking e sessoes."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="grid gap-4 md:grid-cols-2">
          {gameCards.map((game) => (
            <div key={game.id} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className={`rounded-[24px] bg-gradient-to-br ${game.accent} p-5 text-black`}>
                <p className="text-sm uppercase tracking-[0.25em]">Jogo</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold">{game.title}</h2>
                <p className="mt-3 text-sm">{game.description}</p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <Badge className="rounded-full bg-white/10 text-white">
                  {game.players} jogadores
                </Badge>
                <Button className="rounded-full bg-white text-black hover:bg-zinc-200">
                  Jogar agora
                </Button>
              </div>
            </div>
          ))}
        </section>

        <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <Crown className="size-5 text-amber-200" />
            <h2 className="font-heading text-2xl font-semibold">Ranking geral</h2>
          </div>
          <div className="mt-6 space-y-3">
            {gameRanking.map((entry, index) => (
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
                  <Zap className="mr-1 size-3" />
                  {entry.points}
                </Badge>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
